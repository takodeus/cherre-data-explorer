import { ITEMS, LOOKUP_METHODS } from '@/lib/kiosk-data';

interface CartSidebarProps {
  itemsWithQuery: Set<number>;
  queriedMethods: Set<number>[];
  currentScreen: number;
}

const CartSidebar = ({ itemsWithQuery, queriedMethods, currentScreen }: CartSidebarProps) => {
  // Only show on screens 2-3
  if (currentScreen < 2 || currentScreen > 3) return null;

  const scannedItems = ITEMS.filter((_, i) => itemsWithQuery.has(i));
  const totalMethods = queriedMethods.reduce((sum, s) => sum + s.size, 0);

  return (
    <div className="w-[200px] flex-shrink-0 border-l border-border bg-card flex flex-col h-full">
      {/* Cart header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm">🛒</span>
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground">
            Cart
          </span>
          {scannedItems.length > 0 && (
            <span className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {scannedItems.length}
            </span>
          )}
        </div>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto">
        {scannedItems.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="text-2xl mb-2 opacity-30">🛒</div>
            <div className="text-[11px] text-muted-foreground/50">
              Scan items to add<br />them to your cart
            </div>
          </div>
        ) : (
          <div className="py-2">
            {scannedItems.map((item) => {
              const itemIdx = ITEMS.indexOf(item);
              const methodCount = queriedMethods[itemIdx]?.size ?? 0;
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border/40 animate-fade-in-up"
                >
                  <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-sm flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-foreground truncate">{item.name}</div>
                    <div className="text-[9px] text-muted-foreground">{item.price}</div>
                    <div className="flex gap-0.5 mt-1">
                      {LOOKUP_METHODS.map((_, mi) => (
                        <div
                          key={mi}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            queriedMethods[itemIdx]?.has(mi) ? 'bg-primary' : 'bg-border'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart footer */}
      {scannedItems.length > 0 && (
        <div className="px-4 py-3 border-t border-border bg-muted/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-bold tracking-wide uppercase text-muted-foreground">Lookups</span>
            <span className="text-[11px] font-bold text-foreground tabular-nums">{totalMethods}</span>
          </div>
          <div className="w-full bg-border rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(totalMethods / (ITEMS.length * LOOKUP_METHODS.length)) * 100}%` }}
            />
          </div>
          <div className="text-[8px] text-muted-foreground/50 mt-1 text-right">
            {totalMethods} / {ITEMS.length * LOOKUP_METHODS.length} systems queried
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
