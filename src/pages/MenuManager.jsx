import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Coffee } from 'lucide-react';

const MenuManager = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  
  const [categoryName, setCategoryName] = useState('');
  
  const [itemData, setItemData] = useState({
    id: null,
    category_id: '',
    name: '',
    description: '',
    price: '',
    is_available: 1
  });

  const fetchData = async () => {
    try {
      const [catRes, itemsRes] = await Promise.all([
        fetch('https://restoranback.onrender.com/api/categories'),
        fetch('https://restoranback.onrender.com/api/menu-items')
      ]);
      const cats = await catRes.json();
      const items = await itemsRes.json();
      
      setCategories(cats);
      setMenuItems(items);
      
      if (cats.length > 0 && !activeCategoryId) {
        setActiveCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error('Error fetching menu data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName) return;

    try {
      const res = await fetch('https://restoranback.onrender.com/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
      });
      if (res.ok) {
        setIsCategoryModalOpen(false);
        setCategoryName('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Kategoriya va uning ichidagi barcha taomlar o'chib ketadi. Rozimisiz?")) return;
    try {
      await fetch(`https://restoranback.onrender.com/api/categories/${id}`, { method: 'DELETE' });
      if (activeCategoryId === id) setActiveCategoryId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const isEdit = !!itemData.id;
    const url = isEdit ? `https://restoranback.onrender.com/api/menu-items/${itemData.id}` : 'https://restoranback.onrender.com/api/menu-items';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...itemData,
          price: parseFloat(itemData.price),
          category_id: parseInt(itemData.category_id)
        })
      });
      
      if (res.ok) {
        setIsItemModalOpen(false);
        setItemData({ id: null, category_id: activeCategoryId || '', name: '', description: '', price: '', is_available: 1 });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Taom o'chirilishiga rozimisiz?")) return;
    try {
      await fetch(`https://restoranback.onrender.com/api/menu-items/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditItemModal = (item) => {
    setItemData({
      id: item.id,
      category_id: item.category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      is_available: item.is_available
    });
    setIsItemModalOpen(true);
  };

  const openAddItemModal = () => {
    setItemData({
      id: null,
      category_id: activeCategoryId || (categories.length > 0 ? categories[0].id : ''),
      name: '',
      description: '',
      price: '',
      is_available: 1
    });
    setIsItemModalOpen(true);
  };

  const activeCategoryItems = menuItems.filter(item => item.category_id === activeCategoryId);

  return (
    <div className="menu-manager">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 className="page-title">Taomnoma (Menu)</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => setIsCategoryModalOpen(true)} style={{ background: 'var(--bg-hover)', color: 'var(--text-main)' }}>
            <Tag size={18} /> Kategoriya qo'shish
          </button>
          <button className="btn btn-primary" onClick={openAddItemModal} disabled={categories.length === 0}>
            <Plus size={18} /> Taom qo'shish
          </button>
        </div>
      </div>

      <div className="menu-layout">
        {/* Categories Sidebar */}
        <div className="categories-list card" style={{ alignSelf: 'flex-start' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Kategoriyalar</h3>
          {categories.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Kategoriyalar yo'q</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categories.map(cat => (
                <div 
                  key={cat.id} 
                  className={`category-item ${activeCategoryId === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategoryId(cat.id)}
                >
                  <span>{cat.name}</span>
                  <button className="icon-btn delete" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu Items Grid */}
        <div className="menu-items-container">
          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {activeCategoryItems.map(item => (
              <div key={item.id} className={`card menu-item-card ${!item.is_available ? 'unavailable' : ''}`}>
                <div className="menu-item-header">
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.name}</h4>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn edit" onClick={() => openEditItemModal(item)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.5rem 0', minHeight: '40px' }}>
                  {item.description || "Ta'rif yo'q"}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {item.price.toLocaleString()} so'm
                  </span>
                  {!item.is_available && (
                    <span className="badge danger">Mavjud emas</span>
                  )}
                </div>
              </div>
            ))}
            {activeCategoryItems.length === 0 && categories.length > 0 && (
              <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem' }}>
                <Coffee size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
                <p style={{ color: 'var(--text-muted)' }}>Bu kategoriyada hozircha taomlar yo'q</p>
                <button className="btn btn-primary" onClick={openAddItemModal} style={{ marginTop: '1rem' }}>
                  Birinchi taomni qo'shish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Yangi kategoriya</h3>
              <button className="close-btn" onClick={() => setIsCategoryModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label className="form-label">Kategoriya nomi (Masalan: Ichimliklar)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={categoryName} 
                  onChange={e => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
                <button type="button" className="btn" onClick={() => setIsCategoryModalOpen(false)} style={{background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)'}}>Bekor qilish</button>
                <button type="submit" className="btn btn-primary">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{itemData.id ? "Taomni tahrirlash" : "Yangi taom"}</h3>
              <button className="close-btn" onClick={() => setIsItemModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveItem}>
              <div className="form-group">
                <label className="form-label">Kategoriya</label>
                <select 
                  className="form-control" 
                  value={itemData.category_id} 
                  onChange={e => setItemData({...itemData, category_id: e.target.value})}
                  required
                >
                  <option value="">Kategoriyani tanlang</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Taom nomi</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={itemData.name} 
                  onChange={e => setItemData({...itemData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ta'rif (ixtiyoriy)</label>
                <textarea 
                  className="form-control" 
                  value={itemData.description} 
                  onChange={e => setItemData({...itemData, description: e.target.value})}
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Narxi (so'm)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={itemData.price} 
                  onChange={e => setItemData({...itemData, price: e.target.value})}
                  required
                  min="0"
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="is_available"
                  checked={!!itemData.is_available} 
                  onChange={e => setItemData({...itemData, is_available: e.target.checked ? 1 : 0})}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <label htmlFor="is_available" style={{ cursor: 'pointer', margin: 0 }}>Sotuvda mavjud</label>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
                <button type="button" className="btn" onClick={() => setIsItemModalOpen(false)} style={{background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)'}}>Bekor qilish</button>
                <button type="submit" className="btn btn-primary">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
