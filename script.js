// 当前编辑的资源
let currentEditingResource = null;

// 模拟数据
const resourcesData = [
    // 未授权
    {
        id: 1,
        icon: '未',
        iconColor: 'gray',
        name: '未授权',
        url: 'unauthorized.tiger-sec.cn',
        validity: {
            type: 'unauthorized'
        },
        otherAuth: null
    },
    // 单时间段-未生效
    {
        id: 2,
        icon: '单',
        iconColor: 'blue',
        name: '单时间段-未生效',
        url: 'future-single.tiger-sec.cn',
        validity: {
            type: 'temporary',
            startDate: '2025-09-01',
            endDate: '2026-12-31'
        },
        otherAuth: null
    },
    // 单时间段-即将到期
    {
        id: 3,
        icon: '单',
        iconColor: 'orange',
        name: '单时间段-即将到期',
        url: 'expiring.tiger-sec.cn',
        validity: {
            type: 'temporary',
            startDate: '2025-01-01',
            endDate: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        otherAuth: null
    },
    // 单时间段-临时授权
    {
        id: 4,
        icon: '单',
        iconColor: 'green',
        name: '单时间段-临时授权',
        url: 'current.tiger-sec.cn',
        validity: {
            type: 'temporary',
            startDate: '2025-01-01',
            endDate: '2025-12-31'
        },
        otherAuth: null
    },
    // 单时间段-已过期
    {
        id: 5,
        icon: '单',
        iconColor: 'red',
        name: '单时间段-已过期',
        url: 'expired.tiger-sec.cn',
        validity: {
            type: 'temporary',
            startDate: '2024-01-01',
            endDate: '2025-07-31'
        },
        otherAuth: null
    },
    // 单时间段-永久生效
    {
        id: 6,
        icon: '永',
        iconColor: 'blue',
        name: '单时间段-永久生效',
        url: 'permanent.tiger-sec.cn',
        validity: {
            type: 'permanent',
            startDate: null,
            endDate: null
        },
        otherAuth: null
    },
    // 组合授权-未生效
    {
        id: 7,
        icon: '组',
        iconColor: 'blue',
        name: '组合授权-未生效',
        url: 'combo-future.tiger-sec.cn',
        validity: {
            type: 'temporary',
            periods: [
                { startDate: '2025-09-01', endDate: '2025-12-31' },
                { startDate: '2026-02-01', endDate: '2026-04-30' }
            ]
        },
        otherAuth: {
            id: '2',
            name: '单时间段-未生效'
        }
    },
    // 组合授权-即将到期
    {
        id: 8,
        icon: '组',
        iconColor: 'orange',
        name: '组合授权-即将到期',
        url: 'combo-expiring.tiger-sec.cn',
        validity: {
            type: 'temporary',
            periods: [
                { startDate: '2025-01-01', endDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
            ]
        },
        otherAuth: {
            id: '3',
            name: '单时间段-即将到期'
        }
    },
    // 组合授权-临时授权
    {
        id: 9,
        icon: '组',
        iconColor: 'purple',
        name: '组合授权-临时授权',
        url: 'combo-temp.tiger-sec.cn',
        validity: {
            type: 'temporary',
            periods: [
                { startDate: '2025-01-01', endDate: '2025-03-31' },
                { startDate: '2025-07-01', endDate: '2025-12-31' },
                { startDate: '2026-02-01', endDate: '2026-12-31' }
            ]
        },
        otherAuth: {
            id: '4',
            name: '单时间段-临时授权'
        }
    },
    // 组合授权-空窗期
    {
        id: 10,
        icon: '组',
        iconColor: 'orange',
        name: '组合授权-空窗期',
        url: 'combo-gap.tiger-sec.cn',
        validity: {
            type: 'temporary',
            periods: [
                { startDate: '2025-01-01', endDate: '2025-07-31' },
                { startDate: '2025-09-01', endDate: '2026-02-28' }
            ]
        },
        otherAuth: {
            id: '1',
            name: '未授权'
        }
    },
    // 组合授权-已过期
    {
        id: 11,
        icon: '组',
        iconColor: 'red',
        name: '组合授权-已过期',
        url: 'combo-expired.tiger-sec.cn',
        validity: {
            type: 'temporary',
            periods: [
                { startDate: '2024-01-01', endDate: '2025-02-28' },
                { startDate: '2025-03-01', endDate: '2025-06-30' }
            ]
        },
        otherAuth: {
            id: '5',
            name: '单时间段-已过期'
        }
    },
    // 组合授权-永久生效
    {
        id: 12,
        icon: '组',
        iconColor: 'green',
        name: '组合授权-永久生效',
        url: 'combo-perm.tiger-sec.cn',
        validity: {
            type: 'combined',
            periods: [
                { startDate: '2025-01-01', endDate: '2025-12-31' },
                { type: 'permanent' }
            ]
        },
        otherAuth: {
            id: '6',
            name: '单时间段-永久生效'
        }
    },
    {
        id: 1,
        icon: 'N',
        iconColor: 'blue',
        name: '6.永久授权示例-NodeLogin',
        url: 'node.tiger-sec.cn:20442/login',
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
        id: 9,
        icon: 'F',
        iconColor: 'blue',
        name: '2.单时间段-未生效-测试',
        url: 'future.tiger-sec.cn',
        validity: {
            type: 'temporary',
            startDate: '2025-01-01',
            endDate: '2025-12-31'
        }
    },

    {
        id: 2,
        icon: '永',
        iconColor: 'blue',
        name: '6.永久授权示例',
        url: 'permanent.tiger-sec.cn',
        validity: {
            type: 'permanent',
            startDate: null,
            endDate: null
        }
    },
    {
        id: 3,
        icon: '测',
        iconColor: 'purple',
        name: '测试环境服务',
        url: 'example',
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
const authEnableToggle = document.getElementById('authEnableToggle');
const authSettingsContent = document.getElementById('authSettingsContent');
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
let currentEntity = '运维用户组';
let currentEntityType = 'user-group';
let currentAppType = 'web';

// 授权排除名单用户列表
let inheritExceptionUsers = [];

// 系统配置
const systemConfig = {
    // 部门显示配置
    departmentDisplay: {
        maxDisplayLevels: 2,       // 最多显示的层级数
        showFirstLevel: false,     // 是否显示第一层
        showLastLevels: 2,         // 显示最后几层
        separator: '-',            // 层级分隔符
        ellipsis: ''               // 省略符号
    }
};

// 模拟用户数据
const mockUsers = [
    { id: 'user1', name: '张三', department: '集团总部-华北区域-北京分公司-研发中心-前端组' },
    { id: 'user2', name: '李四', department: '集团总部-华北区域-北京分公司-产品部' },
    { id: 'user3', name: '王五', department: '集团总部-华东区域-上海分公司-设计部' },
    { id: 'user4', name: '赵六', department: '集团总部-华北区域-北京分公司-测试部-自动化测试组' },
    { id: 'user5', name: '钱七', department: '集团总部-运维中心' },
    { id: 'user6', name: '孙八', department: '集团总部-华南区域-市场部' },
    { id: 'user7', name: '周九', department: '集团总部-华东区域-销售部' },
    { id: 'user8', name: '吴十', department: '集团总部-财务部' }
];

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
        saveBtn.textContent = `批量授权设置 (${checkedBoxes.length})`;
    }
}

// 批量授权功能
function batchAuthorize() {
    const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
    const selectedIds = Array.from(checkedBoxes).map(checkbox => parseInt(checkbox.getAttribute('data-id')));
    
    if (selectedIds.length > 0) {
        // 创建一个批量授权设置对话框
        openBatchAuthModal(selectedIds);
    }
}

// 打开批量授权设置对话框
function openBatchAuthModal(selectedIds) {
    // 先打开授权设置弹窗，显示第一个应用的设置作为默认值
    openAuthSettingsModal(selectedIds[0]);
    
    // 修改弹窗标题，表明这是批量授权
    const modalTitle = document.createElement('div');
    modalTitle.className = 'modal-batch-title';
    modalTitle.textContent = `批量授权设置 (${selectedIds.length} 个应用)`;
    
    // 将标题添加到modal-content的开头，而不是整个modal
    const modalContent = authSettingsModal.querySelector('.modal-content');
    modalContent.insertBefore(modalTitle, modalContent.firstChild);
    
    // 修改保存按钮的点击事件，使其应用到所有选中的应用
    const originalSaveBtn = saveAuthBtn.cloneNode(true);
    saveAuthBtn.parentNode.replaceChild(originalSaveBtn, saveAuthBtn);
    
    originalSaveBtn.addEventListener('click', function() {
        // 获取当前设置
        const isAuthorized = authEnableToggle.checked;
        let validitySetting;
        
        // 如果授权开关关闭，则设置为无授权状态
        if (!isAuthorized) {
            validitySetting = {
                type: 'none',
                startDate: null,
                endDate: null
            };
        } else if (permanentRadio.checked) {
            validitySetting = {
                type: 'permanent',
                startDate: null,
                endDate: null
            };
        } else {
            // 验证日期输入
            if (!validateDateInputs()) {
                // 如果验证失败，显示提示信息
                if (!startDateInput.value || !endDateInput.value) {
                    alert('请同时设置开始日期和结束日期');
                } else if (startDateInput.value > endDateInput.value) {
                    alert('开始日期不能晚于结束日期');
                }
                return;
            }
            
            validitySetting = {
                type: 'temporary',
                startDate: startDateInput.value,
                endDate: endDateInput.value
            };
        }
        
        // 应用设置到所有选中的应用
        selectedIds.forEach(id => {
            const resourceIndex = resourcesData.findIndex(item => item.id === id);
            if (resourceIndex !== -1) {
                // 更新有效期设置
                resourcesData[resourceIndex].validity = {...validitySetting};
            }
        });
        
        // 重新渲染表格
        renderResourceTable(resourceSearch.value, currentAppType);
        
        // 更新自己的标签页显示的授权数量
        updateSelfTabAuthCount();
        
        // 关闭弹窗
        closeModal();
        
        // 取消所有选中状态
        const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
        checkedBoxes.forEach(checkbox => checkbox.checked = false);
        
        // 更新全选复选框状态
        updateSelectAllCheckboxState();
        
        // 隐藏保存按钮
        updateBatchActionButton();
        
        // 显示成功提示
        alert(`成功保存 ${selectedIds.length} 个应用的授权设置！`);
    });
}

// 更新树结构视图
function updateTreeView(tabType) {
    const entityTree = document.getElementById('entityTree');
    entityTree.innerHTML = '';
    if (tabType === 'organization') {
        entityTree.innerHTML = `
            <div class="tree-node expanded">
                <div class="tree-node-content">集团总部</div>
                <div class="tree-children">
                    <div class="tree-node expanded">
                        <div class="tree-node-content">华北区域</div>
                        <div class="tree-children">
                            <div class="tree-node expanded">
                                <div class="tree-node-content">北京分公司</div>
                                <div class="tree-children">
                                    <div class="tree-node"><div class="tree-node-content">研发中心</div></div>
                                    <div class="tree-node"><div class="tree-node-content">销售中心</div></div>
                                </div>
                            </div>
                            <div class="tree-node">
                                <div class="tree-node-content">天津分公司</div>
                                <div class="tree-children">
                                    <div class="tree-node"><div class="tree-node-content">研发部</div></div>
                                    <div class="tree-node"><div class="tree-node-content">市场部</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tree-node">
                        <div class="tree-node-content">华南区域</div>
                        <div class="tree-children">
                            <div class="tree-node">
                                <div class="tree-node-content">广州分公司</div>
                                <div class="tree-children">
                                    <div class="tree-node"><div class="tree-node-content">技术部</div></div>
                                    <div class="tree-node"><div class="tree-node-content">运营部</div></div>
                                </div>
                            </div>
                            <div class="tree-node">
                                <div class="tree-node-content">深圳分公司</div>
                                <div class="tree-children">
                                    <div class="tree-node"><div class="tree-node-content">产品部</div></div>
                                    <div class="tree-node"><div class="tree-node-content">客服部</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (tabType === 'user-group') {
        entityTree.innerHTML = `
            <div class="tree-list">
                <div class="tree-list-item selected">运维用户组</div>
                <div class="tree-list-item">管理员组</div>
                <div class="tree-list-item">开发组</div>
            </div>
        `;
    } else if (tabType === 'user') {
        // 使用mockUsers数组生成用户列表
        let userListHTML = '<div class="tree-list">';
        mockUsers.forEach((user, index) => {
            userListHTML += `<div class="tree-list-item${index === 0 ? ' selected' : ''}" data-userid="${user.id}">${user.name}</div>`;
        });
        userListHTML += '</div>';
        entityTree.innerHTML = userListHTML;
        
        // 初始化时设置第一个用户为当前编辑资源并检查排除状态
        if (mockUsers.length > 0) {
            currentEditingResource = { userId: mockUsers[0].id };
            // 如果是用户类型，检查排除状态
            if (tabType === 'user') {
                checkExcludedUserStatus();
            }
        }
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
            
            // 如果是用户类型，设置当前编辑资源的用户ID
            if (tabType === 'user' && this.dataset.userid) {
                currentEditingResource = { userId: this.dataset.userid };
                // 检查用户排除状态
                checkExcludedUserStatus();
            }
            
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
    let filteredData = [];
    
    // 根据应用类型过滤
    // 这里只是简单的实现，实际应用中可能需要更复杂的逻辑
    if (appType === 'web') {
        // 在web应用页面中显示12条数据：单个授权放在前6个，组合授权放在后6个
        filteredData = [
            // 单个授权（前6个）
            resourcesData[0], // ID 1 - 未授权
            resourcesData[1], // ID 2 - 单时间段-未生效
            resourcesData[2], // ID 3 - 单时间段-即将到期
            resourcesData[3], // ID 4 - 单时间段-临时授权
            resourcesData[4], // ID 5 - 单时间段-已过期
            resourcesData[5], // ID 6 - 单时间段-永久生效
            // 组合授权（后6个）
            resourcesData[6], // ID 7 - 组合授权-未生效
            resourcesData[7], // ID 8 - 组合授权-即将到期
            resourcesData[8], // ID 9 - 组合授权-临时授权
            resourcesData[9], // ID 10 - 组合授权-空窗期
            resourcesData[10], // ID 11 - 组合授权-已过期
            resourcesData[11], // ID 12 - 组合授权-永久生效
        ]
    } else if (appType === 'tunnel') {
        // 隧道应用显示部分授权数据
        filteredData = [resourcesData[3], resourcesData[5], resourcesData[8]]; // 临时授权、永久授权和组合临时授权
    } else if (appType === 'group') {
        // 组应用显示组合授权数据
        filteredData = [resourcesData[6], resourcesData[7], resourcesData[8], resourcesData[9], resourcesData[10], resourcesData[11]]; // 所有组合授权
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
        
        // 计算授权状态
        let validityStatus = 'permanent';
        let validityText = '永久授权';
        
        if (resource.validity.type === 'none' || resource.validity.type === 'unauthorized') {
            validityStatus = 'none';
            validityText = '未授权';
        } else if (resource.validity.type === 'combined') {
            // 处理时间段授权和永久授权的组合
            validityStatus = 'permanent';
            
            // 提取时间段信息
            const periods = resource.validity.periods;
            let periodTexts = [];
            
            // 检查是否包含永久授权
            const hasPermanent = periods.some(period => period.type === 'permanent');
            
            // 收集所有时间段的文本描述
            periods.forEach(period => {
                if (period.type === 'permanent') {
                    periodTexts.push('永久授权');
                } else if (period.startDate && period.endDate) {
                    periodTexts.push(`${period.startDate} 至 ${period.endDate}`);
                }
            });
            
            // 如果包含永久授权，则状态为永久授权
            if (hasPermanent) {
                validityText = `永久授权 (${periodTexts.join(', ')})`;
            }
        } else if (resource.validity.type === 'temporary') {
            // 处理单个授权时间段的情况
            if (!Array.isArray(resource.validity.periods)) {
                const startDate = new Date(resource.validity.startDate);
                const endDate = new Date(resource.validity.endDate);
                const today = new Date();
                const startDaysDiff = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
                const endDaysDiff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                
                if (startDaysDiff > 0) {
                    validityStatus = 'future';
                    validityText = `未生效授权 (${resource.validity.startDate} 至 ${resource.validity.endDate})`;
                } else if (endDaysDiff < 0) {
                    validityStatus = 'expired';
                    validityText = `授权已过期 (${resource.validity.startDate} 至 ${resource.validity.endDate})`;
                } else if (endDaysDiff <= 7) {
                    validityStatus = 'expiring';
                    validityText = `授权即将到期 (${resource.validity.startDate} 至 ${resource.validity.endDate})`;
                } else {
                    validityStatus = 'temporary';
                    validityText = `临时授权 (${resource.validity.startDate} 至 ${resource.validity.endDate})`;
                }
            } else {
                // 处理多个授权时间段的情况（组合授权）
                const today = new Date();
                const periods = resource.validity.periods;
                
                // 对授权时间段按开始日期排序
                periods.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                
                // 检查当前日期是否在任何授权时间段内
                let isInAnyPeriod = false;
                let isBeforeAllPeriods = true;
                let isAfterAllPeriods = true;
                let periodTexts = [];
                
                for (const period of periods) {
                    const startDate = new Date(period.startDate);
                    const endDate = new Date(period.endDate);
                    periodTexts.push(`${period.startDate} 至 ${period.endDate}`);
                    
                    if (today >= startDate && today <= endDate) {
                        isInAnyPeriod = true;
                    }
                    
                    if (today >= startDate) {
                        isBeforeAllPeriods = false;
                    }
                    
                    if (today <= endDate) {
                        isAfterAllPeriods = false;
                    }
                }
                
                // 判断授权状态
                if (isBeforeAllPeriods) {
                    // 当前日期在所有授权时间段之前
                    validityStatus = 'future';
                    validityText = `未生效授权 (${periodTexts.join(', ')})`;
                } else if (isAfterAllPeriods) {
                    // 当前日期在所有授权时间段之后
                    validityStatus = 'expired';
                    validityText = `授权已过期 (${periodTexts.join(', ')})`;
                } else if (!isInAnyPeriod) {
                    // 当前日期在授权时间段的中间空窗期
                    validityStatus = 'expired';
                    validityText = `授权空窗期 (${periodTexts.join(', ')})`;
                } else {
                    // 当前日期在某个授权时间段内
                    // 找到当前所在的授权时间段
                    const currentPeriod = periods.find(period => {
                        const startDate = new Date(period.startDate);
                        const endDate = new Date(period.endDate);
                        return today >= startDate && today <= endDate;
                    });
                    
                    const endDate = new Date(currentPeriod.endDate);
                    const endDaysDiff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                    
                    if (endDaysDiff <= 7) {
                        validityStatus = 'expiring';
                        validityText = `授权即将到期 (${periodTexts.join(', ')})`;
                    } else {
                        validityStatus = 'temporary';
                        validityText = `临时授权 (${periodTexts.join(', ')})`;
                    }
                }
            }
        }
        
        // 移除授权状态指示器的相关代码
        
        row.innerHTML = `
            <td>
                <input type="checkbox" class="app-checkbox" data-id="${resource.id}">
            </td>
            <td>
                <div class="app-icon-container">
                    <div class="app-icon ${resource.iconColor}">${resource.icon}</div>
                </div>
            </td>
            <td>
                ${resource.name}
            </td>
            <td>${resource.url}</td>
            <td>
                <span class="validity-tag ${validityStatus}" title="${validityText}">${validityText.includes(',') ? validityText.split('(')[0] + '(多个时间段)' : validityText}</span>
            </td>
            <td class="action-column">
                <button class="settings-btn" data-id="${resource.id}">授权设置</button>
                ${resource.otherAuth ? `<button class="view-other-auth-btn" onclick="viewOtherAuth('${resource.otherAuth.id}')">查看其他授权</button>` : `<button class="view-other-auth-btn" disabled>查看其他授权</button>`}
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
// 初始化管理员选择器
function initAdminSelector() {
    const adminSelector = document.getElementById('adminSelector');
    if (adminSelector) {
        adminSelector.addEventListener('change', function() {
            const selectedAdmin = this.value;
            console.log('已切换到管理员:', selectedAdmin);
            // 这里可以根据选择的管理员类型加载不同的数据或权限
            if (selectedAdmin === 'super') {
                alert('已切换到总管理员视图');
            } else {
                alert('已切换到' + this.options[this.selectedIndex].text + '视图');
            }
        });
    }
}

function setupEventListeners() {
    // 关闭弹窗
    closeAuthModal.addEventListener('click', closeModal);
    cancelAuthBtn.addEventListener('click', closeModal);
    
    // 不继承组织机构授权按钮
    const inheritBtn = document.getElementById('inheritBtn');
    if (inheritBtn) {
        inheritBtn.addEventListener('click', toggleInheritOrganizationAuth);
    }
    
    // 初始化管理员选择器
    initAdminSelector();
    
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
    
    // 授权开关切换
    authEnableToggle.addEventListener('change', function() {
        authSettingsContent.style.display = this.checked ? 'block' : 'none';
        
        // 当授权开关从关闭变为开启时，默认选择永久有效
        if (this.checked) {
            permanentRadio.checked = true;
            temporaryRadio.checked = false;
            dateRangeGroup.style.display = 'none';
        }
    });
    
    // 有效期类型切换
    temporaryRadio.addEventListener('change', function() {
        if (this.checked) {
            dateRangeGroup.style.display = 'flex';
            // 设置默认的最小日期为今天
            const today = new Date().toISOString().split('T')[0];
            startDateInput.min = today;
            
            // 如果开始日期有值，设置结束日期的最小值为开始日期
            if (startDateInput.value) {
                endDateInput.min = startDateInput.value;
            }
        }
    });
    
    permanentRadio.addEventListener('change', function() {
        if (this.checked) {
            dateRangeGroup.style.display = 'none';
        }
    });
    
    // 日期输入框联动验证
    startDateInput.addEventListener('change', function() {
        // 清除错误状态
        this.classList.remove('error');
        endDateInput.classList.remove('error');
        
        // 设置结束日期的最小值为开始日期
        endDateInput.min = this.value;
        
        // 如果结束日期早于开始日期，则清空结束日期
        if (endDateInput.value && endDateInput.value < this.value) {
            endDateInput.value = '';
        }
    });
    
    endDateInput.addEventListener('change', function() {
        // 清除错误状态
        this.classList.remove('error');
        startDateInput.classList.remove('error');
        
        // 如果开始日期为空，而结束日期有值，则设置开始日期的最大值为结束日期
        if (!startDateInput.value && this.value) {
            startDateInput.max = this.value;
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
    
    // 设置授权开关状态
    // 如果有有效期设置（无论是永久还是临时），则表示已授权
    const isAuthorized = resource.validity && (resource.validity.type === 'permanent' || 
        (resource.validity.type === 'temporary' && 
         resource.validity.startDate && resource.validity.endDate));
    
    authEnableToggle.checked = isAuthorized;
    authSettingsContent.style.display = isAuthorized ? 'block' : 'none';
    
    // 设置有效期选项
    if (resource.validity.type === 'permanent') {
        permanentRadio.checked = true;
        temporaryRadio.checked = false;
        dateRangeGroup.style.display = 'none';
        // 清空日期输入框的值
        startDateInput.value = '';
        endDateInput.value = '';
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
    // 隐藏弹窗
    authSettingsModal.style.display = 'none';
    currentEditingId = null;
    
    // 清除日期输入框的错误状态
    clearDateInputErrors();
    
    // 移除批量授权标题（如果存在）
    const batchTitle = document.querySelector('.modal-content .modal-batch-title');
    if (batchTitle) {
        batchTitle.remove();
    }
    
    // 重新绑定保存按钮的原始事件处理程序
    const currentSaveBtn = document.getElementById('saveAuthBtn');
    if (currentSaveBtn) {
        const newSaveBtn = currentSaveBtn.cloneNode(true);
        currentSaveBtn.parentNode.replaceChild(newSaveBtn, currentSaveBtn);
        newSaveBtn.addEventListener('click', saveAuthSettings);
    }
}

// 保存授权设置
// 清除日期输入框的错误状态
function clearDateInputErrors() {
    startDateInput.classList.remove('error');
    endDateInput.classList.remove('error');
}

// 验证日期输入并显示视觉提示
function validateDateInputs() {
    clearDateInputErrors();
    
    let isValid = true;
    
    // 验证日期输入
    if (temporaryRadio.checked) {
        if (!startDateInput.value) {
            startDateInput.classList.add('error');
            isValid = false;
        }
        
        if (!endDateInput.value) {
            endDateInput.classList.add('error');
            isValid = false;
        }
        
        // 验证开始日期不能晚于结束日期
        if (startDateInput.value && endDateInput.value && startDateInput.value > endDateInput.value) {
            startDateInput.classList.add('error');
            endDateInput.classList.add('error');
            isValid = false;
        }
    }
    
    return isValid;
}

function saveAuthSettings() {
    if (currentEditingId === null) return;
    
    const resourceIndex = resourcesData.findIndex(item => item.id === currentEditingId);
    if (resourceIndex === -1) return;
    
    // 检查授权开关状态
    if (!authEnableToggle.checked) {
        // 如果授权开关关闭，则设置为无授权状态
        resourcesData[resourceIndex].validity = {
            type: 'none',
            startDate: null,
            endDate: null
        };
    } else {
        // 如果授权开关打开，则根据选择的有效期类型设置
        if (permanentRadio.checked) {
            resourcesData[resourceIndex].validity = {
                type: 'permanent',
                startDate: null,
                endDate: null
            };
        } else {
            // 验证日期输入
            if (!validateDateInputs()) {
                // 如果验证失败，显示提示信息
                if (!startDateInput.value || !endDateInput.value) {
                    alert('请同时设置开始日期和结束日期');
                } else if (startDateInput.value > endDateInput.value) {
                    alert('开始日期不能晚于结束日期');
                }
                return;
            }
            
            resourcesData[resourceIndex].validity = {
                type: 'temporary',
                startDate: startDateInput.value,
                endDate: endDateInput.value
            };
        }
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
    // 获取抽屉式弹窗元素
    const otherAuthDrawer = document.getElementById('otherAuthDrawer');
    const otherAuthTableBody = document.getElementById('otherAuthTableBody');
    
    // 清空表格内容
    otherAuthTableBody.innerHTML = '';
    
    // 添加多行授权源数据（这里使用固定的假数据）
    const authData = [
        {
            appName: '程序员工具集',
            subject: '应用组 → 所有应用组',
            validity: '永久授权',
            creator: '系统管理员',
            role: '总管理员'
        },
        {
            appName: '程序员工具集',
            subject: '应用组 → 所有公司用户',
            validity: '永久授权',
            creator: '系统管理员',
            role: '总管理员'
        },
        {
            appName: '程序员工具集',
            subject: '所有公司部门',
            validity: '2023-01-01 至 2023-12-31',
            creator: '-',
            role: '总管理员'
        }
    ];
    
    // 填充表格数据
    authData.forEach(auth => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${auth.appName}</td>
            <td>${auth.subject}</td>
            <td>${auth.validity}</td>
            <td>${auth.creator}</td>
            <td>${auth.role}</td>
        `;
        otherAuthTableBody.appendChild(row);
    });
    
    // 显示弹窗
    otherAuthDrawer.classList.add('active');
}

// 切换是否继承组织机构授权
// 打开组织机构授权管理弹窗
// 渲染用户列表
function renderUserList() {
    const userList = document.getElementById('exceptionUserList');
    if (!userList) return;
    
    // 清空现有列表
    userList.innerHTML = '';
    
    // 如果没有用户，显示空列表消息
    if (inheritExceptionUsers.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-list-message';
        emptyMessage.textContent = '暂无排除用户，所有用户都将继承组织机构授权';
        userList.appendChild(emptyMessage);
        return;
    }
    
    // 添加用户到列表
    inheritExceptionUsers.forEach(userId => {
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return;
        
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        // 用户信息
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        
        // 用户头像
        const userAvatar = document.createElement('div');
        userAvatar.className = 'user-avatar';
        userAvatar.textContent = user.name.charAt(0);
        
        // 用户名和部门
        const userDetails = document.createElement('div');
        
        const userName = document.createElement('div');
        userName.className = 'user-name';
        userName.textContent = user.name;
        
        const userDept = document.createElement('div');
        userDept.className = 'user-dept';
        userDept.textContent = formatDepartmentDisplay(user.department, systemConfig.departmentDisplay);
        
        // 添加完整部门信息的提示
        userDept.title = user.department;
        
        userDetails.appendChild(userName);
        userDetails.appendChild(userDept);
        
        userInfo.appendChild(userAvatar);
        userInfo.appendChild(userDetails);
        
        // 删除按钮
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-user-btn';
        removeBtn.textContent = '移除';
        removeBtn.dataset.userId = user.id;
        removeBtn.addEventListener('click', function() {
            removeUserFromExceptionList(user.id);
        });
        
        userItem.appendChild(userInfo);
        userItem.appendChild(removeBtn);
        
        userList.appendChild(userItem);
    });
}

// 从排除名单中移除用户
function removeUserFromExceptionList(userId) {
    inheritExceptionUsers = inheritExceptionUsers.filter(id => id !== userId);
    renderUserList();
    checkExcludedUserStatus();
}

// 格式化部门显示
function formatDepartmentDisplay(department, options = {}) {
    // 默认配置
    const config = {
        maxDisplayLevels: 3,       // 最多显示的层级数
        showFirstLevel: true,      // 是否显示第一层
        showLastLevels: 2,         // 显示最后几层
        separator: '-',            // 层级分隔符
        ellipsis: '...',           // 省略符号
        ...options
    };
    
    // 如果部门为空，返回空字符串
    if (!department) return '';
    
    // 按照分隔符拆分部门层级
    const levels = department.split(config.separator);
    
    // 如果层级数量小于等于最大显示层级数，直接返回完整部门名称
    if (levels.length <= config.maxDisplayLevels) {
        return department;
    }
    
    // 构建显示内容
    let result = '';
    
    // 添加第一层（如果配置为显示）
    if (config.showFirstLevel && levels.length > 0) {
        result += levels[0];
    }
    
    // 添加省略号（如果有省略内容）
    if (levels.length > (config.showFirstLevel ? 1 : 0) + config.showLastLevels) {
        if (result) result += config.ellipsis;
        else result = config.ellipsis;
    }
    
    // 添加最后几层
    const lastLevels = levels.slice(-config.showLastLevels).join(config.separator);
    if (lastLevels) {
        if (result) result += config.separator;
        result += lastLevels;
    }
    
    return result;
}

// 打开添加用户弹窗
function openAddUserModal() {
    const addUserModal = document.getElementById('addUserModal');
    const searchInput = document.getElementById('searchInput');
    const availableUsersList = document.getElementById('availableUsersList');
    const selectedUsersList = document.getElementById('selectedUsersList');
    
    // 清空列表和输入框
    availableUsersList.innerHTML = '';
    selectedUsersList.innerHTML = '';
    searchInput.value = '';
    
    // 重置临时选中的用户列表
    tempSelectedUserIds = [];
    
    // 显示弹窗
    addUserModal.style.display = 'flex';
    
    // 加载所有可选用户（未在排除名单中的用户）
    const availableUsers = mockUsers.filter(user => !inheritExceptionUsers.includes(user.id));
    if (availableUsers.length > 0) {
        availableUsers.forEach(user => {
            const userItem = createUserItem(user, 'available');
            availableUsersList.appendChild(userItem);
        });
    } else {
        const noUsers = document.createElement('div');
        noUsers.className = 'empty-list-message';
        noUsers.textContent = '没有可选用户';
        availableUsersList.appendChild(noUsers);
    }
    
    // 聚焦搜索框
    setTimeout(() => searchInput.focus(), 100);
}

// 关闭添加用户弹窗
function closeAddUserModal() {
    const addUserModal = document.getElementById('addUserModal');
    addUserModal.style.display = 'none';
}

// 存储临时选中的用户ID
let tempSelectedUserIds = [];

// 搜索用户并显示在左侧列表
function searchUsers(keyword) {
    // 如果关键词为空，返回所有未在排除名单和临时选中列表中的用户
    const emptyKeyword = !keyword || !keyword.trim();
    
    // 过滤已经在排除名单中的用户和已经在临时选中列表中的用户
    return mockUsers.filter(user => {
        const isInExceptionList = inheritExceptionUsers.includes(user.id);
        const isInTempSelected = tempSelectedUserIds.includes(user.id);
        const matchesKeyword = emptyKeyword || user.name.includes(keyword) || user.department.includes(keyword);
        return matchesKeyword && !isInExceptionList && !isInTempSelected;
    });
}

// 显示搜索结果到左侧列表
function showSearchResults(results) {
    const availableUsersList = document.getElementById('availableUsersList');
    availableUsersList.innerHTML = '';
    
    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'empty-list-message';
        noResults.textContent = '未找到匹配的用户';
        availableUsersList.appendChild(noResults);
        return;
    }
    
    results.forEach(user => {
        const userItem = createUserItem(user, 'available');
        availableUsersList.appendChild(userItem);
    });
}

// 创建用户列表项
function createUserItem(user, listType) {
    const userItem = document.createElement('div');
    userItem.className = 'user-item';
    userItem.dataset.userId = user.id;
    
    // 复选框
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';
    
    // 用户信息
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    
    // 用户头像
    const userAvatar = document.createElement('div');
    userAvatar.className = 'user-avatar';
    userAvatar.textContent = user.name.charAt(0);
    
    // 用户名和部门
    const userDetails = document.createElement('div');
    userDetails.className = 'user-details';
    
    const userName = document.createElement('div');
    userName.className = 'user-name';
    userName.textContent = user.name;
    
    const userDept = document.createElement('div');
    userDept.className = 'user-dept';
    userDept.textContent = user.department;
    
    userDetails.appendChild(userName);
    userDetails.appendChild(userDept);
    
    userInfo.appendChild(userAvatar);
    userInfo.appendChild(userDetails);
    
    // 点击整个结果项选择/取消选择用户
    userItem.addEventListener('click', function() {
        toggleUserSelection(userItem, listType);
    });
    
    userItem.appendChild(checkbox);
    userItem.appendChild(userInfo);
    
    return userItem;
}

// 切换用户选择状态
function toggleUserSelection(userItem, listType) {
    userItem.classList.toggle('selected');
    
    // 在右侧列表中，我们不需要更新tempSelectedUserIds，因为用户已经在列表中
    // 这个函数只用于视觉上的选中状态切换
}

// 添加用户到排除名单
function addUserToExceptionList(userId) {
    if (!inheritExceptionUsers.includes(userId)) {
        inheritExceptionUsers.push(userId);
        renderUserList();
        checkExcludedUserStatus();
    }
}

// 将选中的用户从左侧移动到右侧
function addSelectedUsers() {
    const availableUsersList = document.getElementById('availableUsersList');
    const selectedUsersList = document.getElementById('selectedUsersList');
    const selectedItems = availableUsersList.querySelectorAll('.user-item.selected');
    
    if (selectedItems.length === 0) return;
    
    selectedItems.forEach(item => {
        const userId = item.dataset.userId;
        const user = mockUsers.find(u => u.id === userId);
        
        if (user && !tempSelectedUserIds.includes(userId)) {
            tempSelectedUserIds.push(userId);
            const userItem = createUserItem(user, 'selected');
            selectedUsersList.appendChild(userItem);
        }
        
        item.remove();
    });
}

// 将选中的用户从右侧移回左侧
function removeSelectedUsers() {
    const availableUsersList = document.getElementById('availableUsersList');
    const selectedUsersList = document.getElementById('selectedUsersList');
    const selectedItems = selectedUsersList.querySelectorAll('.user-item.selected');
    
    if (selectedItems.length === 0) return;
    
    const searchInput = document.getElementById('searchInput');
    const keyword = searchInput.value.trim();
    
    selectedItems.forEach(item => {
        const userId = item.dataset.userId;
        const user = mockUsers.find(u => u.id === userId);
        
        if (user) {
            // 如果有搜索关键词，检查用户是否匹配
            const matchesKeyword = !keyword || user.name.includes(keyword) || user.department.includes(keyword);
            
            // 从临时选中列表中移除
            tempSelectedUserIds = tempSelectedUserIds.filter(id => id !== userId);
            
            // 如果匹配搜索条件，添加回左侧列表
            if (matchesKeyword) {
                const userItem = createUserItem(user, 'available');
                availableUsersList.appendChild(userItem);
            }
        }
        
        item.remove();
    });
}

// 确认添加用户到排除名单
function confirmAddUsers() {
    // 移除对tempSelectedUserIds.length的检查，允许在没有选择用户的情况下也能点击确定按钮
    
    // 如果有选择用户，则添加到排除名单
    tempSelectedUserIds.forEach(userId => {
        if (!inheritExceptionUsers.includes(userId)) {
            inheritExceptionUsers.push(userId);
        }
    });
    
    renderUserList();
    checkExcludedUserStatus();
    closeAddUserModal();
}

// 检查当前选中的用户是否在排除列表中
function checkExcludedUserStatus() {
    const mainContent = document.querySelector('.main-content');
    let excludedWarning = document.getElementById('excludedUserWarning');
    
    // 如果没有选中的资源，移除警告
    if (!currentEditingResource) {
        if (excludedWarning) {
            excludedWarning.remove();
        }
        return;
    }
    
    // 检查当前选中的用户是否在排除列表中
    const isUserExcluded = inheritExceptionUsers.includes(currentEditingResource.userId);
    
    if (isUserExcluded) {
        // 如果用户被排除且警告不存在，创建警告
        if (!excludedWarning) {
            excludedWarning = document.createElement('div');
            excludedWarning.id = 'excludedUserWarning';
            excludedWarning.className = 'inherit-warning';
            
            const infoIcon = document.createElement('span');
            infoIcon.className = 'info-icon';
            infoIcon.textContent = 'i';
            
            const warningText = document.createElement('p');
            warningText.textContent = '当前选中的用户在授权排除名单中，不会继承组织机构的授权设置。';
            
            excludedWarning.appendChild(infoIcon);
            excludedWarning.appendChild(warningText);
            
            // 插入到主内容区域的顶部
            if (mainContent) {
                mainContent.insertBefore(excludedWarning, mainContent.firstChild);
            }
        }
    } else {
        // 如果用户不在排除列表中但警告存在，移除警告
        if (excludedWarning) {
            excludedWarning.remove();
        }
    }
    
    console.log('检查用户排除状态:', currentEditingResource.userId, isUserExcluded);
}

function toggleInheritOrganizationAuth() {
    // 获取当前状态
    const inheritBtn = document.getElementById('inheritBtn');
    const isInheriting = inheritBtn.classList.contains('active');
    
    // 获取弹窗元素
    const inheritSettingsModal = document.getElementById('inheritSettingsModal');
    const inheritToggle = document.getElementById('inheritToggle');
    const inheritWarning = document.getElementById('inheritWarning');
    const closeInheritModal = document.getElementById('closeInheritModal');
    const cancelInheritBtn = document.getElementById('cancelInheritBtn');
    const saveInheritBtn = document.getElementById('saveInheritBtn');
    const addUserBtn = document.getElementById('addUserBtn');
    const userListContainer = document.getElementById('userListContainer');
    
    // 根据当前状态设置开关的初始状态
    inheritToggle.checked = isInheriting;
    
    // 显示或隐藏用户列表
    if (isInheriting) {
        userListContainer.style.display = 'block';
    } else {
        userListContainer.style.display = 'none';
    }
    
    // 渲染用户列表
    renderUserList();
    
    // 移除之前的事件监听器，避免重复绑定
    const newInheritToggle = inheritToggle.cloneNode(true);
    inheritToggle.parentNode.replaceChild(newInheritToggle, inheritToggle);
    
    // 监听开关状态变化
    newInheritToggle.addEventListener('change', function() {
        if (this.checked) {
            userListContainer.style.display = 'block';
        } else {
            userListContainer.style.display = 'none';
        }
    });
    
    // 关闭弹窗的函数
    const closeInheritSettingsModal = function() {
        inheritSettingsModal.style.display = 'none';
    };
    
    // 移除之前的事件监听器
    const newCloseBtn = closeInheritModal.cloneNode(true);
    closeInheritModal.parentNode.replaceChild(newCloseBtn, closeInheritModal);
    
    const newCancelBtn = cancelInheritBtn.cloneNode(true);
    cancelInheritBtn.parentNode.replaceChild(newCancelBtn, cancelInheritBtn);
    
    const newSaveBtn = saveInheritBtn.cloneNode(true);
    saveInheritBtn.parentNode.replaceChild(newSaveBtn, saveInheritBtn);
    
    const newAddUserBtn = addUserBtn.cloneNode(true);
    addUserBtn.parentNode.replaceChild(newAddUserBtn, addUserBtn);
    
    // 绑定关闭按钮事件
    newCloseBtn.addEventListener('click', closeInheritSettingsModal);
    newCancelBtn.addEventListener('click', closeInheritSettingsModal);
    
    // 绑定添加用户按钮事件
    newAddUserBtn.addEventListener('click', openAddUserModal);
    
    // 保存设置
    newSaveBtn.addEventListener('click', function() {
        const isInheritingNew = newInheritToggle.checked;
        
        // 更新按钮状态
        if (isInheritingNew) {
            inheritBtn.classList.add('active');
            inheritBtn.textContent = '组织机构授权管理';
            // 实现继承组织机构授权的逻辑
            console.log('已设置为继承组织机构授权，排除用户数量：', inheritExceptionUsers.length);
        } else {
            inheritBtn.classList.remove('active');
            inheritBtn.textContent = '组织机构授权管理';
            // 实现不继承组织机构授权的逻辑
            console.log('已设置为不继承组织机构授权');
            // 清空排除用户列表
            inheritExceptionUsers = [];
        }
        
        // 关闭弹窗
        closeInheritSettingsModal();
        
        // 更新资源表格
        renderResourceTable(resourceSearch.value, currentAppType);
    });
    
    // 显示弹窗
    inheritSettingsModal.style.display = 'flex';
}

 // 关闭查看其他授权抽屉式弹窗
function closeOtherAuthDrawer() {
    const otherAuthDrawer = document.getElementById('otherAuthDrawer');
    otherAuthDrawer.classList.remove('active');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initPage();
    
    // 添加关闭查看其他授权抽屉式弹窗的事件监听器
    const closeOtherAuthDrawerBtn = document.getElementById('closeOtherAuthDrawer');
    if (closeOtherAuthDrawerBtn) {
        closeOtherAuthDrawerBtn.addEventListener('click', closeOtherAuthDrawer);
    }
    
    // 点击抽屉式弹窗外部区域关闭弹窗
    const otherAuthDrawer = document.getElementById('otherAuthDrawer');
    if (otherAuthDrawer) {
        otherAuthDrawer.addEventListener('click', function(event) {
            if (event.target === this) {
                closeOtherAuthDrawer();
            }
        });
    }
    
    // 确保保存按钮绑定了正确的事件处理程序
    const saveAuthBtn = document.getElementById('saveAuthBtn');
    if (saveAuthBtn) {
        saveAuthBtn.addEventListener('click', saveAuthSettings);
    }
    
    // 绑定添加用户弹窗的事件
    const closeAddUserModalBtn = document.getElementById('closeAddUserModal');
    const cancelAddUserBtn = document.getElementById('cancelAddUserBtn');
    const confirmAddUsersBtn = document.getElementById('confirmAddUsersBtn');
    const addSelectedUsersBtn = document.getElementById('addSelectedUsersBtn');
    const removeSelectedUsersBtn = document.getElementById('removeSelectedUsersBtn');
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (closeAddUserModalBtn) {
        closeAddUserModalBtn.addEventListener('click', closeAddUserModal);
    }
    
    if (cancelAddUserBtn) {
        cancelAddUserBtn.addEventListener('click', closeAddUserModal);
    }
    
    if (confirmAddUsersBtn) {
        confirmAddUsersBtn.addEventListener('click', confirmAddUsers);
    }
    
    if (addSelectedUsersBtn) {
        addSelectedUsersBtn.addEventListener('click', addSelectedUsers);
    }
    
    if (removeSelectedUsersBtn) {
        removeSelectedUsersBtn.addEventListener('click', removeSelectedUsers);
    }
    
    if (searchBtn && searchInput) {
        // 搜索按钮点击事件
        searchBtn.addEventListener('click', function() {
            const keyword = searchInput.value.trim();
            const results = searchUsers(keyword);
            showSearchResults(results);
        });
        
        // 搜索框回车事件
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const keyword = searchInput.value.trim();
                const results = searchUsers(keyword);
                showSearchResults(results);
                e.preventDefault();
            }
        });
    }
    
    // 初始检查用户排除状态
    checkExcludedUserStatus();
});
""
