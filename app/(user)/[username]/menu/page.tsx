
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBusinessByUsername, getFullMenu } from "@/lib/supabase";
import MenuDisplay from "@/components/MenuDisplay";

interface MenuCategory {
  id: number;
  name: string;
  display_order: number;
  is_active: boolean;
  menu_subcategories: MenuSubcategory[];
}

interface MenuSubcategory {
  id: number;
  name: string;
  display_order: number;
  is_active: boolean;
  menu_items: MenuItem[];
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  is_active: boolean;
  display_order: number;
}

const MenuPage = () => {
  const params = useParams();
  const username = params.username as string;
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [brandColor, setBrandColor] = useState<string>("#ED1D33");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | 'all'>(null);

  useEffect(() => {
    async function fetchMenu() {
      if (username) {
        const business = await getBusinessByUsername(username);
        if (business) {
          setBrandColor(business.brand_primary_color || "#ED1D33");
          const menuData = await getFullMenu(business.id);
          setMenu(menuData);
          if (menuData && menuData.length > 0) {
            setActiveCategory('all');
          }
        }
        setLoading(false);
      }
    }
    fetchMenu();
  }, [username]);

  if (loading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Menu</h1>
        <div className="text-gray-600">Loading menu...</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>
      {menu && menu.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Sidebar: Categories */}
          <aside className="w-full md:w-64 mb-4 md:mb-0 shrink-0">
            <div className="bg-white rounded-xl shadow p-2 md:p-4 sticky md:top-24 flex md:block overflow-x-auto">
              <ul className="flex md:block gap-2 md:gap-0 w-full">
                <li key="all" className="min-w-[120px] md:min-w-0">
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeCategory === 'all'
                        ? 'bg-[#ED1D33] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={activeCategory === 'all' ? { backgroundColor: brandColor } : {}}
                    onClick={() => setActiveCategory('all')}
                  >
                    All
                  </button>
                </li>
                {menu.map((category) => (
                  <li key={category.id} className="min-w-[120px] md:min-w-0">
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeCategory === category.id
                          ? 'bg-[#ED1D33] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={activeCategory === category.id ? { backgroundColor: brandColor } : {}}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          {/* Main: Menu Items */}
          <section className="flex-1">
            {activeCategory !== null ? (
              (() => {
                let categoriesToShow = [];
                if (activeCategory === 'all') {
                  categoriesToShow = menu;
                } else {
                  const selectedCategory = menu.find((cat) => cat.id === activeCategory);
                  if (selectedCategory) categoriesToShow = [selectedCategory];
                }
                if (!categoriesToShow.length) {
                  return <div className="text-gray-600">No subcategories found for this category.</div>;
                }
                return (
                  <div className="space-y-8">
                    {categoriesToShow.map((category) => (
                      category.menu_subcategories && category.menu_subcategories.length > 0 ? (
                        category.menu_subcategories
                          .filter((sub) => sub.is_active)
                          .sort((a, b) => a.display_order - b.display_order)
                          .map((subcategory) => (
                            <div key={subcategory.id}>
                              <h3 className="text-xl font-bold mb-4 pb-2 border-b-2" style={{ borderColor: brandColor }}>
                                {subcategory.name}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {subcategory.menu_items && subcategory.menu_items.length > 0 ? (
                                  subcategory.menu_items
                                    .filter((item) => item.is_active)
                                    .sort((a, b) => a.display_order - b.display_order)
                                    .map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                      >
                                        {item.image && (
                                          <div className="shrink-0">
                                            <img
                                              src={item.image}
                                              alt={item.name}
                                              width={80}
                                              height={80}
                                              className="rounded-lg object-cover"
                                              onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                              }}
                                            />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-semibold text-gray-900 text-lg">
                                              {item.name}
                                            </h4>
                                            <span className="font-bold text-lg whitespace-nowrap" style={{ color: brandColor }}>
                                              Rs.{Math.floor(item.price)}
                                            </span>
                                          </div>
                                          {item.description && (
                                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                              {item.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))
                                ) : (
                                  <div className="text-gray-500">No items in this subcategory yet</div>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-gray-500">No subcategories available for this category.</div>
                      )
                    ))}
                  </div>
                );
              })()
            ) : (
              <div className="text-gray-600">Select a category to view menu items.</div>
            )}
          </section>
        </div>
      ) : (
        <div className="text-gray-600">No menu available for this restaurant.</div>
      )}
    </main>
  );
};

export default MenuPage;
