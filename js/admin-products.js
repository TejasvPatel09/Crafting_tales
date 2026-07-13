(function () {
  'use strict';

  let categories = [];
  let products = [];
  let editingId = null; // null = creating new
  let mediaItems = []; // [{type, src}]

  document.addEventListener('DOMContentLoaded', async () => {
    const session = await requireAdminSession();
    if (!session) return;
    wireLogoutButton();

    await loadCategories();
    await loadProducts();
    renderTable();

    document.getElementById('add-product-btn').addEventListener('click', () => openModal(null));
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', closeModal);
    document.getElementById('product-form').addEventListener('submit', onSave);
    document.getElementById('f-customizable').addEventListener('change', (e) => {
      document.getElementById('custom-label-field').hidden = !e.target.checked;
    });
    document.getElementById('f-media-upload').addEventListener('change', onFilesChosen);
  });

  async function loadCategories() {
    const { data, error } = await sb.from('categories').select('slug,label').neq('slug', 'all').order('sort_order');
    if (error) { console.error(error); return; }
    categories = data;
    const sel = document.getElementById('f-category');
    sel.innerHTML = categories.map(c => `<option value="${c.slug}">${escapeHtml(c.label)}</option>`).join('');
  }

  async function loadProducts() {
    const { data, error } = await sb.from('products').select('*').order('sort_order');
    if (error) { console.error(error); alert('Failed to load products: ' + error.message); return; }
    products = data;
  }

  function renderTable() {
    const tbody = document.getElementById('product-rows');
    tbody.innerHTML = products.map(p => {
      const d = p.data;
      const thumb = (d.media && d.media[0] && d.media[0].type === 'image') ? d.media[0].src : '';
      const catLabel = (categories.find(c => c.slug === p.category) || {}).label || p.category;
      return `
        <tr data-id="${p.id}">
          <td>${thumb ? `<img class="thumb" src="${escapeAttr(thumb)}" />` : ''}</td>
          <td>${escapeHtml(d.name)}</td>
          <td>${escapeHtml(catLabel)}</td>
          <td>₹${Number(d.price).toLocaleString('en-IN')}</td>
          <td>${p.featured ? '★' : ''}</td>
          <td><span class="pill pill-${p.status}">${p.status}</span></td>
          <td class="row-actions">
            <button class="btn edit-btn" data-id="${p.id}">Edit</button>
            <button class="btn delete-btn" data-id="${p.id}">Delete</button>
          </td>
        </tr>`;
    }).join('');

    tbody.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', () => openModal(b.dataset.id)));
    tbody.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', () => onDelete(b.dataset.id)));
  }

  function openModal(id) {
    editingId = id;
    document.getElementById('form-error').textContent = '';
    document.getElementById('upload-status').textContent = '';
    const form = document.getElementById('product-form');
    form.reset();

    if (id) {
      const p = products.find(x => x.id === id);
      const d = p.data;
      document.getElementById('modal-title').textContent = 'Edit Product';
      document.getElementById('f-id').value = p.id;
      document.getElementById('f-id').disabled = true;
      document.getElementById('f-name').value = d.name || '';
      document.getElementById('f-category').value = p.category || '';
      document.getElementById('f-price').value = d.price || 0;
      document.getElementById('f-badge').value = d.badge || '';
      document.getElementById('f-description').value = d.description || '';
      document.getElementById('f-specs').value = (d.specs || []).map(s => `${s[0]}: ${s[1]}`).join('\n');
      document.getElementById('f-featured').checked = !!p.featured;
      document.getElementById('f-customizable').checked = !!d.customizable;
      document.getElementById('f-status').value = p.status || 'active';
      document.getElementById('f-custom-label').value = d.customLabel || '';
      document.getElementById('custom-label-field').hidden = !d.customizable;
      mediaItems = JSON.parse(JSON.stringify(d.media || []));
    } else {
      document.getElementById('modal-title').textContent = 'Add Product';
      document.getElementById('f-id').disabled = false;
      document.getElementById('f-status').value = 'active';
      document.getElementById('custom-label-field').hidden = true;
      mediaItems = [];
    }
    renderMediaList();
    document.getElementById('modal-overlay').classList.add('open');
    document.getElementById('product-modal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.getElementById('product-modal').classList.remove('open');
  }

  function renderMediaList() {
    const list = document.getElementById('media-list');
    list.innerHTML = mediaItems.map((m, i) => `
      <div class="media-item">
        ${m.type === 'video' ? `<video src="${escapeAttr(m.src)}" muted></video>` : `<img src="${escapeAttr(m.src)}" />`}
        <button type="button" data-idx="${i}" class="remove-media-btn">×</button>
      </div>
    `).join('');
    list.querySelectorAll('.remove-media-btn').forEach(b => {
      b.addEventListener('click', () => {
        mediaItems.splice(Number(b.dataset.idx), 1);
        renderMediaList();
      });
    });
  }

  async function onFilesChosen(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const statusEl = document.getElementById('upload-status');
    const productId = document.getElementById('f-id').value.trim() || 'unassigned';

    let successCount = 0;
    for (const file of files) {
      statusEl.textContent = `Uploading ${file.name}…`;
      const path = `${productId}/${Date.now()}-${file.name}`;
      const { error } = await sb.storage.from('products').upload(path, file);
      if (error) {
        alert(`Failed to upload ${file.name}: ${error.message}`);
        continue;
      }
      const { data: { publicUrl } } = sb.storage.from('products').getPublicUrl(path);
      mediaItems.push({ type: file.type.startsWith('video') ? 'video' : 'image', src: publicUrl });
      renderMediaList();
      successCount++;
    }
    statusEl.textContent = `Successfully uploaded ${successCount} of ${files.length} file(s).`;
    e.target.value = '';
  }

  async function onSave(e) {
    e.preventDefault();
    const errEl = document.getElementById('form-error');
    errEl.textContent = '';
    const saveBtn = document.getElementById('save-btn');

    const id = document.getElementById('f-id').value.trim();
    if (!/^[a-z0-9-]+$/.test(id)) {
      errEl.textContent = 'Product ID must be lowercase letters, numbers, and dashes only.';
      return;
    }
    if (!mediaItems.length) {
      errEl.textContent = 'Add at least one image or video.';
      return;
    }

    const category = document.getElementById('f-category').value;
    const featured = document.getElementById('f-featured').checked;
    const status = document.getElementById('f-status').value;
    const customizable = document.getElementById('f-customizable').checked;

    const specs = document.getElementById('f-specs').value
      .split('\n').map(l => l.trim()).filter(Boolean)
      .map(l => {
        const idx = l.indexOf(':');
        return idx === -1 ? [l, ''] : [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
      });

    const data = {
      id, name: document.getElementById('f-name').value.trim(),
      category, tags: [category],
      price: Number(document.getElementById('f-price').value),
      featured, customizable,
      description: document.getElementById('f-description').value.trim(),
      specs, media: mediaItems
    };
    const badge = document.getElementById('f-badge').value.trim();
    if (badge) data.badge = badge;
    if (customizable) data.customLabel = document.getElementById('f-custom-label').value.trim();

    // preserve variants if editing an existing product that had them (not editable in this form)
    if (editingId) {
      const existing = products.find(x => x.id === editingId);
      if (existing && existing.data.variants) data.variants = existing.data.variants;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';

    let error;
    if (editingId) {
      ({ error } = await sb.from('products')
        .update({ category, featured, status, data, updated_at: new Date().toISOString() })
        .eq('id', editingId));
    } else {
      ({ error } = await sb.from('products')
        .insert({ id, category, featured, status, sort_order: products.length + 1, data }));
    }

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';

    if (error) {
      errEl.textContent = error.message;
      return;
    }

    await loadProducts();
    renderTable();
    closeModal();
  }

  async function onDelete(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const { error } = await sb.from('products').delete().eq('id', id);
    if (error) { alert('Failed to delete: ' + error.message); return; }
    await loadProducts();
    renderTable();
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function escapeAttr(s) { return String(s).replace(/"/g, '&quot;'); }
})();
