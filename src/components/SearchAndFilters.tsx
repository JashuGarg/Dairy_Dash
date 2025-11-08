import { Search, Filter, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  milkTypeFilter: 'all' | 'cow' | 'buffalo';
  onMilkTypeChange: (type: 'all' | 'cow' | 'buffalo') => void;
  outstandingFilter: 'all' | 'has_outstanding' | 'paid';
  onOutstandingChange: (filter: 'all' | 'has_outstanding' | 'paid') => void;
}

export const SearchAndFilters = ({
  searchQuery,
  onSearchChange,
  milkTypeFilter,
  onMilkTypeChange,
  outstandingFilter,
  onOutstandingChange,
}: SearchAndFiltersProps) => {
  const { language } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = milkTypeFilter !== 'all' || outstandingFilter !== 'all';

  const clearAllFilters = () => {
    onMilkTypeChange('all');
    onOutstandingChange('all');
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={language === 'en' ? 'Search by name or phone number...' : 'नाम या फोन नंबर से खोजें...'}
          className="w-full pl-12 pr-32 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20 focus:outline-none transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              title={language === 'en' ? 'Clear search' : 'खोज साफ़ करें'}
            >
              <X className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative p-2 rounded-lg transition-colors ${
              hasActiveFilters
                ? 'bg-[var(--green)] text-white'
                : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
            }`}
            title={language === 'en' ? 'Filters' : 'फ़िल्टर'}
          >
            <Filter className="w-5 h-5" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--orange)] rounded-full border-2 border-[var(--bg-card)]"></span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      {showFilters && (
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] space-y-4 animate-scale-in">
          {/* Milk Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              {language === 'en' ? 'Milk Type' : 'दूध प्रकार'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onMilkTypeChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  milkTypeFilter === 'all'
                    ? 'bg-[var(--green)] text-white shadow-md'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-accent)]'
                }`}
              >
                {language === 'en' ? 'All' : 'सभी'}
              </button>
              <button
                onClick={() => onMilkTypeChange('cow')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  milkTypeFilter === 'cow'
                    ? 'bg-[var(--green)] text-white shadow-md'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-accent)]'
                }`}
              >
                🐄 {language === 'en' ? 'Cow' : 'गाय'}
              </button>
              <button
                onClick={() => onMilkTypeChange('buffalo')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  milkTypeFilter === 'buffalo'
                    ? 'bg-[var(--green)] text-white shadow-md'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-accent)]'
                }`}
              >
                🐃 {language === 'en' ? 'Buffalo' : 'भैंस'}
              </button>
            </div>
          </div>

          {/* Outstanding Filter */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              {language === 'en' ? 'Payment Status' : 'भुगतान स्थिति'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onOutstandingChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  outstandingFilter === 'all'
                    ? 'bg-[var(--green)] text-white shadow-md'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-accent)]'
                }`}
              >
                {language === 'en' ? 'All' : 'सभी'}
              </button>
              <button
                onClick={() => onOutstandingChange('has_outstanding')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  outstandingFilter === 'has_outstanding'
                    ? 'bg-[var(--orange)] text-white shadow-md'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-accent)]'
                }`}
              >
                💰 {language === 'en' ? 'Has Outstanding' : 'बकाया है'}
              </button>
              <button
                onClick={() => onOutstandingChange('paid')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  outstandingFilter === 'paid'
                    ? 'bg-[var(--green)] text-white shadow-md'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-accent)]'
                }`}
              >
                ✓ {language === 'en' ? 'Fully Paid' : 'पूर्ण भुगतान'}
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-[var(--border)]">
              <button
                onClick={clearAllFilters}
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-accent)] transition-colors"
              >
                {language === 'en' ? 'Clear All Filters' : 'सभी फ़िल्टर साफ़ करें'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
