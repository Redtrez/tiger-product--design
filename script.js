// 模拟数据
const resourcesData = [
    {
        id: 1,
        icon: 'N',
        iconColor: 'blue',
        name: 'NodeLogin-登录授权管理服务',
        url: 'node.tiger-sec.cn:20442/login',
        inherit: true,
        validity: {
            type: 'permanent',
            startDate: null,
            endDate: null
        },
        otherAuth: {
            id: 'auth1',
            name: '办公应用组(应用组)-所有公司员工(用户组)'
        }
    },
    {
        id: 2,
        icon: 'N',
        iconColor: 'blue',
        name: 'Node-登录授权管理系统',
        url: 'node.tiger-sec.cn:20443',
        inherit: true,
        validity: {
            type: 'permanent',
            startDate: null,
            endDate: null
        },
        otherAuth: {
            id: 'auth2',
            name: '程序员工具网站(应用组)-所有应用组(用户组)'
        }
    },
    {
        id: 3,
        icon: '测',
        iconColor: 'purple',
        name: '测试环境服务',
        url: 'example',
        inherit: true,
        validity: {
            type: 'permanent',
            startDate: null,
            endDate: null
        }
    },
    {
        id: 4,
        icon: 'A',
        iconColor: 'green',
        name: 'app',
        url: 'app.id-net.cn:20080',
        inherit: false,
        validity: {
            type: 'temporary',
            startDate: '2023-12-01',
            endDate: '2024-12-01'
        }
    },
    {
        id: 5,
        icon: 'T',
        iconColor: 'cyan',
        name: 'testdata',
        url: 'testdata.id-net.cn:20080',
        inherit: true,
        validity: {
            type: 'temporary',
            startDate: '2023-10-01',
            endDate: '2023-12-31'
        }
    },
    {
        id: 6,
        icon: '企',
        iconColor: 'orange',
        name: '企业级微服务在线调试平台',
        url: 'qa.tiger-sec.cn',
        inherit: true,
        validity: {
            type: 'permanent',
            startDate: null,
            endDate: null
        }
    },
    {
        id: 7,
        icon: 'W',
        iconColor: 'blue',
        name: 'wordpress 测试',
        url: 'wp.prod.tiger-sec.cn',
        inherit: true,
        validity: {
            type: 'permanent',
            startDate: null,
            endDate: null
        }
    },
    {
        id: 8,
        icon: '监',
        iconColor: 'red',
        name: '监控平台',
        url: 'zentao.tiger-sec.cn',
        inherit: false,
        validity: {
            type: 'temporary',
            startDate: '2023-11-15',
            endDate: '2024-02-15'
        }
    }
];

// DOM元素
const resourceTableBody = document.getElementById('resourceTableBody');
const authSettingsModal = document.getElementById('authSettingsModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const inheritToggle = document.getElementById('inheritToggle');
const permanentRadio = document.getElementById('permanentRadio');
const temporaryRadio = document.getElementById('temporaryRadio');
const dateRangeGroup = document.getElementById('dateRangeGroup');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const saveAuthBtn = document.getElementById('saveAuthBtn');
const cancelAuthBtn = document.getElementById('cancelAuthBtn');
const resourceSearch = document.getElementById('resourceSearch');
const entitySearch = document.getElementById('entitySearch');
const entityTree = document.getElementById('entityTree');
const appTabs = document.querySelectorAll('.app-tab');
const sidebarTabs = document.querySelectorAll('.sidebar-tab');

// 当前编辑的资源ID
let currentEditingId = null;

// 当前选中的实体和应用类型
let currentEntity = '全部用户组';
let currentEntityType = 'user-group';
let currentAppType = 'web';

// 初始化页面
function initPage() {
    // 初始化树结构视图
    updateTreeView('user-group');
    
    // 初始化资源表格
    renderResourceTable('', 'web');
    
    // 更新已授权标签页显示的授权数量
    updateSelfTabAuthCount();
    
    // 添加批量操作按钮
    addBatchActionButton();
    
    // 设置事件监听器
    setupEventListeners();
}

// 更新保存按钮功能
function addBatchActionButton() {
    // 获取保存按钮
    const saveBtn = document.getElementById('addAuthBtn');
    if (saveBtn) {
        // 初始状态隐藏
        saveBtn.style.display = 'none';
        // 添加批量授权功能
        saveBtn.addEventListener('click', batchAuthorize);
    }
}

// 更新全选复选框状态
function updateSelectAllCheckboxState() {
    const selectAllCheckbox = document.getElementById('selectAllApps');
    const checkboxes = document.querySelectorAll('.app-checkbox');
    const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
    
    if (selectAllCheckbox) {
        // 如果所有复选框都被选中，则全选复选框也应该被选中
        selectAllCheckbox.checked = checkboxes.length > 0 && checkedBoxes.length === checkboxes.length;
        // 如果部分复选框被选中，可以设置一个半选状态（如果浏览器支持）
        selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
    }
}

// 更新保存按钮显示状态
function updateBatchActionButton() {
    const saveBtn = document.getElementById('addAuthBtn');
    const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
    
    if (saveBtn) {
        saveBtn.style.display = checkedBoxes.length > 0 ? 'block' : 'none';
        saveBtn.textContent = `保存 (${checkedBoxes.length})`;
    }
}

// 批量授权功能
function batchAuthorize() {
    const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
    const selectedIds = Array.from(checkedBoxes).map(checkbox => parseInt(checkbox.getAttribute('data-id')));
    
    if (selectedIds.length > 0) {
        // 这里可以打开授权设置弹窗或执行其他批量操作
        alert(`已选择 ${selectedIds.length} 个应用进行批量授权，应用ID: ${selectedIds.join(', ')}`);
        // 实际应用中，这里可能会打开一个批量授权的弹窗
        // openBatchAuthModal(selectedIds);
    }
}

// 更新树结构视图
function updateTreeView(tabType) {
    const entityTree = document.getElementById('entityTree');
    entityTree.innerHTML = '';
    if (tabType === 'organization') {
        entityTree.innerHTML = `
            <div class="tree-node expanded">
                <div class="tree-node-content">总部</div>
                <div class="tree-children">
                    <div class="tree-node"><div class="tree-node-content">研发部</div></div>
                    <div class="tree-node"><div class="tree-node-content">市场部</div></div>
                </div>
            </div>
        `;
    } else if (tabType === 'user-group') {
        entityTree.innerHTML = `
            <div class="tree-list">
                <div class="tree-list-item selected">全部用户组</div>
                <div class="tree-list-item">管理员组</div>
                <div class="tree-list-item">开发组</div>
            </div>
        `;
    } else if (tabType === 'user') {
        entityTree.innerHTML = `
            <div class="tree-list">
                <div class="tree-list-item selected">张三</div>
                <div class="tree-list-item">李四</div>
                <div class="tree-list-item">王五</div>
            </div>
        `;
    }
    
    // 隐藏保存按钮，因为切换了实体类型，之前的选择已经失效
    const saveBtn = document.getElementById('addAuthBtn');
    if (saveBtn) {
        saveBtn.style.display = 'none';
    }
    // 重新绑定点击事件
    let selector = tabType === 'organization' ? '.tree-node-content' : '.tree-list-item';
    document.querySelectorAll(selector).forEach(node => {
        node.addEventListener('click', function(e) {
            document.querySelectorAll(selector + '.selected').forEach(selected => {
                selected.classList.remove('selected');
            });
            this.classList.add('selected');
            currentEntity = this.textContent.trim();
            renderResourceTable(resourceSearch.value, currentAppType);
            updateSelfTabAuthCount();
            
            // 隐藏保存按钮，因为切换了实体，之前的选择已经失效
            const saveBtn = document.getElementById('addAuthBtn');
            if (saveBtn) {
                saveBtn.style.display = 'none';
            }
            
            // 重置资源表格的滚动条位置到最左侧
            document.querySelector('.resource-table').scrollLeft = 0;
        });
    });
}

// 渲染资源表格
function renderResourceTable(searchTerm = '', appType = 'web') {
    // 清空表格
    resourceTableBody.innerHTML = '';
    
    // 过滤数据
    let filteredData = resourcesData;
    
    // 根据应用类型过滤
    // 这里只是简单的实现，实际应用中可能需要更复杂的逻辑
    // 假设前3个是Web应用，中间3个是隧道应用，最后2个是应用组
    if (appType === 'web') {
        filteredData = resourcesData.slice(0, 3);
    } else if (appType === 'tunnel') {
        filteredData = resourcesData.slice(3, 6);
    } else if (appType === 'group') {
        filteredData = resourcesData.slice(6, 8);
    }
    
    // 根据搜索词过滤
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.url.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // 隐藏保存按钮，因为切换了数据源，之前的选择已经失效
    const saveBtn = document.getElementById('addAuthBtn');
    if (saveBtn) {
        saveBtn.style.display = 'none';
    }
    
    // 渲染数据
    filteredData.forEach(resource => {
        const row = document.createElement('tr');
        
        // 计算有效期状态
        let validityStatus = 'permanent';
        let validityText = '永久有效';
        
        if (resource.validity.type === 'temporary') {
            const endDate = new Date(resource.validity.endDate);
            const today = new Date();
            const daysDiff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysDiff < 0) {
                validityStatus = 'expired';
                validityText = `已过期 (${resource.validity.startDate} 至 ${resource.validity.endDate})`;
            } else if (daysDiff <= 7) {
                validityStatus = 'expiring';
                validityText = `即将到期 (${resource.validity.startDate} 至 ${resource.validity.endDate})`;
            } else {
                validityStatus = 'temporary';
                validityText = `${resource.validity.startDate} 至 ${resource.validity.endDate}`;
            }
        }
        
        row.innerHTML = `
            <td>
                <input type="checkbox" class="app-checkbox" data-id="${resource.id}">
            </td>
            <td>
                <div class="app-icon ${resource.iconColor}">${resource.icon}</div>
            </td>
            <td>
                ${resource.name}
                ${!resource.inherit ? '<span class="no-inherit-tag">不继承</span>' : ''}
            </td>
            <td>${resource.url}</td>
            <td>
                <span class="validity-tag ${validityStatus}">${validityText}</span>
            </td>
            <td>
                <button class="settings-btn" data-id="${resource.id}">授权设置</button>
            </td>
            <td>
                ${resource.otherAuth ? `${resource.otherAuth.name} <a href="javascript:void(0)" class="view-other-auth" onclick="viewOtherAuth('${resource.otherAuth.id}')">查看</a>` : '-'}
            </td>
        `;
        
        resourceTableBody.appendChild(row);
    });
    
    // 添加授权设置按钮事件
    document.querySelectorAll('.settings-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const resourceId = parseInt(this.getAttribute('data-id'));
            openAuthSettingsModal(resourceId);
        });
    });
    
    // 重置全选复选框状态
    const selectAllCheckbox = document.getElementById('selectAllApps');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 关闭弹窗
    closeAuthModal.addEventListener('click', closeModal);
    cancelAuthBtn.addEventListener('click', closeModal);
    
    // 全选/取消全选功能
    const selectAllCheckbox = document.getElementById('selectAllApps');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.app-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBatchActionButton();
        });
    }
    
    // 监听表格中的复选框变化
    resourceTableBody.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('app-checkbox')) {
            updateSelectAllCheckboxState();
            updateBatchActionButton();
        }
    });
    
    // 有效期类型切换
    temporaryRadio.addEventListener('change', function() {
        if (this.checked) {
            dateRangeGroup.style.display = 'flex';
        }
    });
    
    permanentRadio.addEventListener('change', function() {
        if (this.checked) {
            dateRangeGroup.style.display = 'none';
        }
    });
    
    // 保存授权设置
    saveAuthBtn.addEventListener('click', saveAuthSettings);
    
    // 搜索功能
    resourceSearch.addEventListener('input', function() {
        renderResourceTable(this.value, currentAppType);
        
        // 隐藏保存按钮，因为搜索改变了显示的资源，之前的选择可能已经失效
        const saveBtn = document.getElementById('addAuthBtn');
        if (saveBtn) {
            saveBtn.style.display = 'none';
        }
        
        // 重置资源表格的滚动条位置到最左侧
        document.querySelector('.resource-table').scrollLeft = 0;
    });
    
    // 实体搜索功能
    entitySearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const treeNodes = document.querySelectorAll('.tree-node-content');
        
        treeNodes.forEach(node => {
            const text = node.textContent.toLowerCase();
            const parentNode = node.closest('.tree-node');
            
            if (text.includes(searchTerm)) {
                parentNode.style.display = 'block';
                // 如果是子节点，确保父节点展开
                const parentTreeNode = parentNode.parentElement.closest('.tree-node');
                if (parentTreeNode) {
                    parentTreeNode.classList.add('expanded');
                }
            } else {
                // 如果是父节点，检查子节点是否有匹配项
                const childNodes = parentNode.querySelectorAll('.tree-node-content');
                let hasVisibleChild = false;
                
                childNodes.forEach(childNode => {
                    if (childNode !== node && childNode.textContent.toLowerCase().includes(searchTerm)) {
                        hasVisibleChild = true;
                    }
                });
                
                if (hasVisibleChild) {
                    parentNode.style.display = 'block';
                    parentNode.classList.add('expanded');
                } else {
                    parentNode.style.display = searchTerm ? 'none' : 'block';
                }
            }
        });
    });
    
    // 点击弹窗外部关闭弹窗
    window.addEventListener('click', function(event) {
        if (event.target === authSettingsModal) {
            closeModal();
        }
    });
    
    // 侧边栏标签页切换（用户组/组织机构/用户）
document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelector('.sidebar-tab.active').classList.remove('active');
        this.classList.add('active');
        
        // 更新当前实体类型
        currentEntityType = this.getAttribute('data-tab');
        
        // 根据选择的标签页更新树结构
        updateTreeView(currentEntityType);
        
        // 更新授权计数显示
        updateSelfTabAuthCount();
        
        // 隐藏保存按钮，因为切换了实体类型，之前的选择已经失效
        const saveBtn = document.getElementById('addAuthBtn');
        if (saveBtn) {
            saveBtn.style.display = 'none';
        }
        
        // 重置资源表格的滚动条位置到最左侧
        document.querySelector('.resource-table').scrollLeft = 0;
    });
});
    
    // 应用标签页切换
    appTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelector('.app-tab.active').classList.remove('active');
            this.classList.add('active');
            
            // 更新当前应用类型
            currentAppType = this.getAttribute('data-app-tab');
            
            // 根据选择的应用类型更新资源表格
            renderResourceTable(resourceSearch.value, currentAppType);
            
            // 更新已授权标签页显示的授权数量
            updateSelfTabAuthCount();
            
            // 隐藏保存按钮，因为切换了应用类型，之前的选择已经失效
            const saveBtn = document.getElementById('addAuthBtn');
            if (saveBtn) {
                saveBtn.style.display = 'none';
            }
            
            // 重置资源表格的滚动条位置到最左侧
            document.querySelector('.resource-table').scrollLeft = 0;
        });
    });
    
    // 树节点点击事件
    document.querySelectorAll('.tree-node-content').forEach(node => {
        node.addEventListener('click', function(e) {
            // 如果点击的是父节点，切换展开/折叠状态
            const parentNode = this.parentElement;
            if (parentNode.querySelector('.tree-children')) {
                parentNode.classList.toggle('expanded');
                e.stopPropagation(); // 防止事件冒泡
            }
            
            // 选中当前节点
            document.querySelectorAll('.tree-node-content.selected').forEach(selected => {
                selected.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // 更新当前选中的实体
            currentEntity = this.textContent.trim();
            
            // 更新资源表格
            renderResourceTable(resourceSearch.value, currentAppType);
            
            // 更新已授权标签页显示的授权数量
            updateSelfTabAuthCount();
            
            // 重置资源表格的滚动条位置到最左侧
            document.querySelector('.resource-table').scrollLeft = 0;
        });
    });
}

// 打开授权设置弹窗
function openAuthSettingsModal(resourceId) {
    const resource = resourcesData.find(item => item.id === resourceId);
    if (!resource) return;
    
    currentEditingId = resourceId;
    
    // 设置继承选项
    inheritToggle.checked = resource.inherit;
    
    // 设置有效期选项
    if (resource.validity.type === 'permanent') {
        permanentRadio.checked = true;
        temporaryRadio.checked = false;
        dateRangeGroup.style.display = 'none';
    } else {
        permanentRadio.checked = false;
        temporaryRadio.checked = true;
        dateRangeGroup.style.display = 'flex';
        startDateInput.value = resource.validity.startDate;
        endDateInput.value = resource.validity.endDate;
    }
    
    // 显示弹窗
    authSettingsModal.style.display = 'flex';
}

// 关闭弹窗
function closeModal() {
    authSettingsModal.style.display = 'none';
    currentEditingId = null;
}

// 保存授权设置
function saveAuthSettings() {
    if (currentEditingId === null) return;
    
    const resourceIndex = resourcesData.findIndex(item => item.id === currentEditingId);
    if (resourceIndex === -1) return;
    
    // 更新继承设置
    resourcesData[resourceIndex].inherit = inheritToggle.checked;
    
    // 更新有效期设置
    if (permanentRadio.checked) {
        resourcesData[resourceIndex].validity = {
            type: 'permanent',
            startDate: null,
            endDate: null
        };
    } else {
        resourcesData[resourceIndex].validity = {
            type: 'temporary',
            startDate: startDateInput.value,
            endDate: endDateInput.value
        };
    }
    
    // 重新渲染表格
    renderResourceTable(resourceSearch.value, currentAppType);
    
    // 更新自己的标签页显示的授权数量
    updateSelfTabAuthCount();
    
    // 关闭弹窗
    closeModal();
    
    // 显示成功提示（可以添加一个toast提示）
    alert('授权设置已保存');
}

// 更新已授权显示的授权数量
function updateSelfTabAuthCount() {
    // 统计不同类型应用的授权数量
    let webAppCount = 0;
    let tunnelAppCount = 0;
    let appGroupCount = 0;
    
    // 根据当前选中的实体和实体类型过滤数据
    // 这里只是模拟，实际应用中可能需要从服务器获取数据
    
    // 根据当前选中的实体类型和实体名称调整授权数量
    // 这里使用简单的随机数来模拟不同实体的授权数量差异
    const entityFactor = currentEntity.length % 3 + 1;
    const typeFactor = currentEntityType === 'user-group' ? 1 : 
                      currentEntityType === 'organization' ? 2 : 
                      currentEntityType === 'user' ? 3 : 1;
    
    // 假设前3个是Web应用，中间3个是隧道应用，最后2个是应用组
    // 根据当前选中的实体和实体类型调整授权数量
    webAppCount = Math.min(3, Math.floor(resourcesData.slice(0, 3).length / (entityFactor * typeFactor) + 1));
    tunnelAppCount = Math.min(3, Math.floor(resourcesData.slice(3, 6).length / (entityFactor * typeFactor) + 1));
    appGroupCount = Math.min(2, Math.floor(resourcesData.slice(6, 8).length / (entityFactor * typeFactor) + 1));
    
    // 更新已授权文本
    document.getElementById('authCount').textContent = `已授权：${webAppCount}个Web应用，${tunnelAppCount}个隧道应用，${appGroupCount}个应用组`;
}

 function viewOtherAuth(authId) {
     // TODO: 实现查看其他授权详情弹窗
     alert('查看授权ID: ' + authId);
 }

 // 页面加载完成后初始化
 document.addEventListener('DOMContentLoaded', initPage);
""
