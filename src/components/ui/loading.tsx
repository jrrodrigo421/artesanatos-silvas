export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-dark">
      <div className="text-center animate-fade-in">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-neutral-600 rounded-full animate-spin">
            <div className="w-full h-full border-4 border-transparent border-t-brand-orange border-r-brand-blue rounded-full"></div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-glow-orange animate-pulse-gentle">
              <span className="text-white font-bold text-lg">S</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Silva's Artesanatos
          </h2>
          <p className="text-neutral-300 animate-pulse">
            Carregando...
          </p>
        </div>

        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-brand-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}; 