import { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, X, Check, XCircle, Clock, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { deliveryCalendarService } from '../lib/deliveryCalendarService';
import type { Customer, DeliveryCalendar, DeliveryStatus, BillingSummary } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';

interface DeliveryCalendarProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onBillUpdate: () => void;
}

export function DeliveryCalendarComponent({ customer, isOpen, onClose, onBillUpdate }: DeliveryCalendarProps) {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [deliveryRecords, setDeliveryRecords] = useState<Map<string, DeliveryCalendar>>(new Map());
  const [loading, setLoading] = useState(false);
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);

  // Load delivery records for current month
  const loadDeliveryRecords = useCallback(async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const records = await deliveryCalendarService.getDeliveryCalendar(
        customer.id,
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      );

      const recordsMap = new Map<string, DeliveryCalendar>();
      records.forEach((record) => {
        recordsMap.set(record.delivery_date, record);
      });
      setDeliveryRecords(recordsMap);
    } catch (error) {
      console.error('Error loading delivery records:', error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, customer.id]);

  const loadBillingSummary = useCallback(async () => {
    try {
      const summary = await deliveryCalendarService.calculateBill(customer.id);
      setBillingSummary(summary);
    } catch (error) {
      console.error('Error loading billing summary:', error);
    }
  }, [customer.id]);

  useEffect(() => {
    if (isOpen) {
      loadDeliveryRecords();
      loadBillingSummary();
    }
  }, [isOpen, loadDeliveryRecords, loadBillingSummary]);

  const handleDateClick = async (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    const existing = deliveryRecords.get(dateStr);
    let newStatus: DeliveryStatus;

    // Toggle between skipped and delivered (default is delivered)
    // Click once: mark as skipped (red)
    // Click again: mark as delivered (green)
    if (!existing) {
      // First click: mark as skipped
      newStatus = 'skipped';
    } else if (existing.status === 'skipped') {
      // Second click: mark as delivered
      newStatus = 'delivered';
    } else {
      // If already delivered, mark as skipped
      newStatus = 'skipped';
    }

    try {
      if (!user) throw new Error('User not authenticated');
      
      await deliveryCalendarService.updateDeliveryStatus(
        user.id,
        customer.id,
        dateStr,
        newStatus,
        newStatus === 'delivered' ? customer.daily_liters : 0
      );

      await loadDeliveryRecords();
      await loadBillingSummary();
      onBillUpdate();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      alert('Failed to update delivery status');
    }
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    
    // Add empty cells for days before first of month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(new Date(year, month, -(firstDayOfWeek - i - 1)));
    }
    
    // Add all days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getStatusForDate = (date: Date): DeliveryStatus | null => {
    const dateStr = date.toISOString().split('T')[0];
    const record = deliveryRecords.get(dateStr);
    
    // If no record exists and date is not in future and not before start date,
    // assume it's delivered (default state)
    if (!record) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      
      const startDate = customer.start_date ? new Date(customer.start_date) : null;
      if (startDate) startDate.setHours(0, 0, 0, 0);
      
      // If date is between start date and today (inclusive), default to delivered
      if (checkDate <= today && (!startDate || checkDate >= startDate)) {
        return 'delivered';
      }
      return null;
    }
    
    return record.status;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFutureDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const isBeforeStartDate = (date: Date): boolean => {
    if (!customer.start_date) return false;
    const startDate = new Date(customer.start_date);
    startDate.setHours(0, 0, 0, 0);
    return date < startDate;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getStatusColor = (status: DeliveryStatus | null): string => {
    if (!status) return 'bg-slate-700/50 border-slate-600';
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
      case 'skipped':
        return 'bg-red-500/20 border-red-500 text-red-400';
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      default:
        return 'bg-slate-700/50 border-slate-600';
    }
  };

  const getStatusIcon = (status: DeliveryStatus | null) => {
    if (!status) return null;
    switch (status) {
      case 'delivered':
        return <Check className="w-4 h-4" />;
      case 'skipped':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const downloadBillPDF = () => {
    if (!billingSummary) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text('Milk Delivery Bill', pageWidth / 2, 20, { align: 'center' });
    
    // Line separator
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.5);
    doc.line(20, 25, pageWidth - 20, 25);
    
    // Customer Details Section
    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text('Customer Details:', 20, 35);
    
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105); // slate-600
    let yPos = 45;
    
    const customerDetails = [
      ['Customer Name:', customer.name],
      ['Phone:', customer.phone],
      ['Start Date:', customer.start_date || 'N/A'],
      ['Milk Type:', customer.milk_type.charAt(0).toUpperCase() + customer.milk_type.slice(1)],
      ['Daily Quantity:', `${customer.daily_liters} Liters`],
      ['Rate per Liter:', `₹${customer.rate_per_liter}`],
    ];
    
    customerDetails.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 70, yPos);
      yPos += 8;
    });
    
    // Billing Summary Section
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text('Billing Summary:', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105); // slate-600
    
    const billingDetails = [
      ['Total Days:', billingSummary.total_days.toString()],
      ['Delivered Days:', billingSummary.delivered_days.toString()],
      ['Skipped Days:', billingSummary.skipped_days.toString()],
      ['Total Liters Delivered:', (billingSummary.delivered_days * customer.daily_liters).toFixed(2) + ' L'],
    ];
    
    billingDetails.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 70, yPos);
      yPos += 8;
    });
    
    // Total Amount Box
    yPos += 10;
    doc.setFillColor(59, 130, 246); // blue-500
    doc.roundedRect(20, yPos, pageWidth - 40, 20, 3, 3, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255); // white
    doc.setFont('helvetica', 'bold');
    doc.text('Total Bill Amount:', 25, yPos + 13);
    doc.text(`₹${billingSummary.calculated_bill.toFixed(2)}`, pageWidth - 25, yPos + 13, { align: 'right' });
    
    // Outstanding Amount
    if (customer.outstanding_amount > 0) {
      yPos += 30;
      doc.setFillColor(239, 68, 68); // red-500
      doc.roundedRect(20, yPos, pageWidth - 40, 20, 3, 3, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('Outstanding Amount:', 25, yPos + 13);
      doc.text(`₹${customer.outstanding_amount.toFixed(2)}`, pageWidth - 25, yPos + 13, { align: 'right' });
    }
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFont('helvetica', 'italic');
    doc.text('Generated on: ' + new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), pageWidth / 2, doc.internal.pageSize.getHeight() - 20, { align: 'center' });
    
    doc.text('Thank you for your business!', pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });
    
    // Save PDF
    doc.save(`${customer.name.replace(/\s+/g, '_')}_Bill_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (!isOpen) return null;

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-emerald-500" />
                Delivery Calendar
              </h2>
              <p className="text-slate-400 mt-1">{customer.name} • {customer.phone}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Billing Summary */}
          {billingSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <p className="text-xs text-slate-400">Total Days</p>
                <p className="text-xl font-bold text-white">{billingSummary.total_days}</p>
              </div>
              <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/30">
                <p className="text-xs text-emerald-400">Delivered</p>
                <p className="text-xl font-bold text-emerald-400">{billingSummary.delivered_days}</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                <p className="text-xs text-red-400">Skipped</p>
                <p className="text-xl font-bold text-red-400">{billingSummary.skipped_days}</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                <p className="text-xs text-blue-400">Total Bill</p>
                <p className="text-xl font-bold text-blue-400">₹{billingSummary.calculated_bill.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-white">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Week Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const status = getStatusForDate(date);
                const isTodayDate = isToday(date);
                const isFuture = isFutureDate(date);
                const isBeforeStart = isBeforeStartDate(date);
                const isDisabled = !isCurrentMonth || isFuture || isBeforeStart;

                return (
                  <button
                    key={index}
                    onClick={() => !isDisabled && handleDateClick(date)}
                    disabled={isDisabled}
                    className={`
                      aspect-square p-2 rounded-lg border-2 transition-all duration-200
                      ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
                      ${isTodayDate ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-800' : ''}
                      ${getStatusColor(status)}
                      ${!isCurrentMonth ? 'opacity-50' : ''}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className={`text-sm font-medium ${status ? '' : 'text-slate-300'}`}>
                        {date.getDate()}
                      </span>
                      {status && (
                        <div className="mt-1">
                          {getStatusIcon(status)}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h4 className="text-sm font-medium text-slate-400 mb-3">Legend</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 bg-emerald-500/20 border-emerald-500"></div>
                <span className="text-sm text-slate-300">Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 bg-red-500/20 border-red-500"></div>
                <span className="text-sm text-slate-300">Skipped</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 bg-slate-700/50 border-slate-600"></div>
                <span className="text-sm text-slate-300">Not Marked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 ring-2 ring-blue-500 bg-slate-700/50 border-slate-600"></div>
                <span className="text-sm text-slate-300">Today</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={downloadBillPDF}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Bill
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
