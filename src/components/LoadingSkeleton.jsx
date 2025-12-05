"use client";

// Reusable loading skeleton components
export function CardSkeleton({ lines = 3, showImage = false }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
      {showImage && (
        <div className="w-full h-32 bg-gray-200 rounded-lg mb-4" />
      )}
      <div className="space-y-3">
        {[...Array(lines)].map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-200 rounded ${
              i === lines - 1 ? "w-2/3" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function StrategySkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-6 bg-green-100 rounded-full w-16" />
      </div>
      <div className="flex gap-4 mt-3">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex gap-4">
          {[...Array(cols)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-24" />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 animate-pulse">
            <div className="flex gap-4">
              {[...Array(cols)].map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded w-20" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
      <div className="h-64 bg-gray-100 rounded-lg flex items-end justify-center gap-2 px-4 pb-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-t w-8"
            style={{ height: `${20 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-32" />
          </div>
        ))}
      </div>
      
      {/* Chart */}
      <ChartSkeleton />
      
      {/* Cards Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={4} />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-xl border p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-10 bg-gray-100 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Full page loading state with custom message
export function PageLoading({ message }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
      {message && (
        <p className="mt-4 text-gray-500 text-sm">{message}</p>
      )}
    </div>
  );
}

// Error state with retry button
export function ErrorState({ message, onRetry, language = "en" }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6">
      <div className="text-5xl mb-4">😕</div>
      <h3 className="text-xl font-semibold mb-2">
        {language === "uk" ? "Щось пішло не так" : "Something went wrong"}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md">
        {message || (language === "uk" 
          ? "Не вдалося завантажити дані. Спробуйте ще раз."
          : "Failed to load data. Please try again.")}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          {language === "uk" ? "Спробувати знову" : "Try Again"}
        </button>
      )}
    </div>
  );
}

// Empty state
export function EmptyState({ icon = "📭", title, description, action, language = "en" }) {
  return (
    <div className="min-h-[30vh] flex flex-col items-center justify-center text-center p-6">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">
        {title || (language === "uk" ? "Немає даних" : "No Data")}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
}

