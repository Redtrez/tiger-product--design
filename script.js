// 当前编辑的资源
let currentEditingResource = null;

// 获取Toast图标的辅助函数
function getToastIcon(type) {
    switch(type) {
        case 'success': return '✓';
        case 'error': return '✕';
        case 'warning': return '⚠';
        case 'info': return 'ℹ';
        default: return 'ℹ';
    }
}

// Toast提示函数
function showToast(message, type = 'info') {
    // 创建toast容器（如果不存在）
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // 创建toast内容容器
    const toastContent = document.createElement('div');
    toastContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    `;
    
    // 创建图标元素
    const iconSpan = document.createElement('span');
    iconSpan.textContent = getToastIcon(type);
    iconSpan.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: white;
        margin-right: 12px;
        flex-shrink: 0;
    `;
    
    // 创建消息文本
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    messageSpan.style.cssText = `
        flex: 1;
        margin-right: 12px;
    `;
    
    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: opacity 0.2s;
    `;
    
    closeBtn.addEventListener('click', () => {
        closeToast(toast);
    });
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.opacity = '1';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.opacity = '0.7';
    });
    
    // 组装toast内容
    toastContent.appendChild(iconSpan);
    toastContent.appendChild(messageSpan);
    toastContent.appendChild(closeBtn);
    toast.appendChild(toastContent);
    
    // 设置toast样式
    const baseStyles = `
        padding: 12px 16px;
        margin-bottom: 10px;
        border-radius: 6px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        pointer-events: auto;
        min-width: 320px;
        max-width: 480px;
        white-space: nowrap;
        background-color: white;
        border: 1px solid #e8e8e8;
    `;
    
    let typeStyles = '';
    let iconBgColor = '';
    switch(type) {
        case 'success':
            typeStyles = 'color: #52c41a; border-left: 4px solid #52c41a;';
            iconBgColor = '#52c41a';
            break;
        case 'error':
            typeStyles = 'color: #ff4d4f; border-left: 4px solid #ff4d4f;';
            iconBgColor = '#ff4d4f';
            break;
        case 'warning':
            typeStyles = 'color: #faad14; border-left: 4px solid #faad14;';
            iconBgColor = '#faad14';
            break;
        default:
            typeStyles = 'color: #1890ff; border-left: 4px solid #1890ff;';
            iconBgColor = '#1890ff';
    }
    
    toast.style.cssText = baseStyles + typeStyles;
    iconSpan.style.backgroundColor = iconBgColor;
    
    // 添加到容器
    toastContainer.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // 自动消失
    const autoCloseTimer = setTimeout(() => {
        closeToast(toast);
    }, 3000);
    
    // 鼠标悬停时暂停自动关闭
    toast.addEventListener('mouseenter', () => {
        clearTimeout(autoCloseTimer);
    });
    
    toast.addEventListener('mouseleave', () => {
        setTimeout(() => {
            closeToast(toast);
        }, 1000);
    });
}

// 关闭toast的辅助函数
function closeToast(toast) {
    if (toast && toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// 确保DOM元素存在的辅助函数
function ensureElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`元素 #${id} 不存在`);
    }
    return element;
}

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
            startDate: '2025-09-15',
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
                { startDate: '2025-09-15', endDate: '2025-12-31', isDirect: true },
                { startDate: '2026-02-01', endDate: '2026-04-30', isDirect: false }
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
                { startDate: '2025-01-01', endDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isDirect: true },
                { startDate: '2025-06-01', endDate: '2025-08-31', isDirect: false }
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
                { startDate: '2025-01-01', endDate: '2025-03-31', isDirect: true },
                { startDate: '2025-07-01', endDate: '2025-12-31', isDirect: false },
                { startDate: '2026-02-01', endDate: '2026-12-31', isDirect: false }
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
                { startDate: '2025-01-01', endDate: '2025-07-31', isDirect: true },
                { startDate: '2025-09-10', endDate: '2026-02-28', isDirect: false }
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
                { startDate: '2024-01-01', endDate: '2025-02-28', isDirect: true },
                { startDate: '2025-03-01', endDate: '2025-06-30', isDirect: false }
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
                { startDate: '2025-01-01', endDate: '2025-12-31', isDirect: true },
                { type: 'permanent', isDirect: false }
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
            startDate: '2025-10-01',
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
    },
    {
        id: 999,
        icon: '测',
        iconColor: 'green',
        name: '测试假数据-验证显示功能',
        url: 'test-fake-data.example.com',
        validity: {
            type: 'permanent',
            startDate: null,
            endDate: null
        },
        otherAuth: null
     }
];

// DOM元素
let resourceTableBody = null;

// 在DOMContentLoaded事件中初始化DOM元素引用
function initDOMReferences() {
    resourceTableBody = ensureElement('resourceTableBody');
}
const authSettingsModal = document.getElementById('authSettingsModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const authSettingsContent = document.getElementById('authSettingsContent');
const authTypeIndicator = document.getElementById('authTypeIndicator');
// 使用let而不是const，因为这些元素会在openAuthSettingsModal函数中重新赋值
let authTypeBadge = document.getElementById('authTypeBadge');
let permanentRadio = document.getElementById('permanentRadio');
let temporaryRadio = document.getElementById('temporaryRadio');
let dateRangeGroup = document.getElementById('dateRangeGroup');
let startDateInput = document.getElementById('startDate');
let endDateInput = document.getElementById('endDate');
const saveAuthBtn = document.getElementById('saveAuthBtn');
const cancelAuthBtn = document.getElementById('cancelAuthBtn');
const removeAuthBtn = document.getElementById('removeAuthBtn');
const resourceSearch = document.getElementById('resourceSearch');
const entitySearch = document.getElementById('entitySearch');
const entityTree = document.getElementById('entityTree');
const appTabs = document.querySelectorAll('.app-tab');
const sidebarTabs = document.querySelectorAll('.sidebar-tab');

// 当前编辑的资源ID
let currentEditingId = null;
// 当前编辑模式
let currentEditingMode = 'add';
// 原始日期值（用于编辑模式下的校验）
let originalStartDate = null;
let originalEndDate = null;

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
    
    // 添加批量操作按钮（必须在渲染表格之前初始化）
    addBatchActionButton();
    
    // 初始化资源表格
    renderResourceTable('', 'web');
    
    // 更新已授权标签页显示的授权数量
    updateSelfTabAuthCount();
    
    // 设置事件监听器
    setupEventListeners();
}

// 初始化批量操作按钮
function addBatchActionButton() {
    // 获取批量取消授权按钮
    const batchRemoveAuthBtn = document.getElementById('batchRemoveAuthBtn');
    // 获取批量授权按钮
    const batchAuthBtn = document.getElementById('batchAuthBtn');
    
    if (batchRemoveAuthBtn) {
        // 初始状态隐藏
        batchRemoveAuthBtn.style.display = 'none';
        // 添加批量取消授权功能
        batchRemoveAuthBtn.addEventListener('click', batchRemoveAuthorize);
    }
    
    if (batchAuthBtn) {
        // 初始状态隐藏
        batchAuthBtn.style.display = 'none';
        // 添加批量授权功能
        batchAuthBtn.addEventListener('click', openBatchAuthModal);
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

// 更新批量操作按钮显示状态
function updateBatchActionButton() {
    const batchRemoveAuthBtn = document.getElementById('batchRemoveAuthBtn');
    const batchAuthBtn = document.getElementById('batchAuthBtn');
    const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
    
    // 只有当有复选框被选中时才显示批量操作按钮
    if (checkedBoxes.length > 0) {
        if (batchRemoveAuthBtn) {
            batchRemoveAuthBtn.style.display = 'block';
            batchRemoveAuthBtn.textContent = `批量取消授权 (${checkedBoxes.length})`;
        }
        if (batchAuthBtn) {
            batchAuthBtn.style.display = 'block';
            batchAuthBtn.textContent = `批量授权 (${checkedBoxes.length})`;
        }
    } else {
        if (batchRemoveAuthBtn) {
            batchRemoveAuthBtn.style.display = 'none';
        }
        if (batchAuthBtn) {
            batchAuthBtn.style.display = 'none';
        }
    }
    console.log('更新批量操作按钮，当前选中数量:', checkedBoxes.length);
}

// 批量授权功能
// 打开批量授权弹窗
function openBatchAuthModal() {
    const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
    const selectedIds = Array.from(checkedBoxes).map(checkbox => parseInt(checkbox.getAttribute('data-id')));
    
    if (selectedIds.length > 0) {
        // 显示批量授权弹窗
        const batchAuthSettingsModal = document.getElementById('batchAuthSettingsModal');
        if (batchAuthSettingsModal) {
            batchAuthSettingsModal.style.display = 'flex';
            
            // 初始化批量授权弹窗的表单
            initBatchAuthForm();
            
            // 绑定关闭按钮事件
            const closeBtn = document.getElementById('closeBatchAuthModal');
            if (closeBtn) {
                closeBtn.addEventListener('click', closeBatchAuthModal);
            }
            
            // 绑定取消按钮事件
            const cancelBtn = document.getElementById('cancelBatchAuthBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', closeBatchAuthModal);
            }
            
            // 绑定保存按钮事件
            const saveBtn = document.getElementById('saveBatchAuthBtn');
            if (saveBtn) {
                // 移除之前的事件监听器
                const newSaveBtn = saveBtn.cloneNode(true);
                saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
                
                // 添加新的事件监听器
                newSaveBtn.addEventListener('click', batchAuthorize);
            }
        }
    }
}

// 初始化批量授权弹窗的表单
function initBatchAuthForm() {
    // 获取表单元素
    const permanentRadio = document.getElementById('batchPermanentRadio');
    const temporaryRadio = document.getElementById('batchTemporaryRadio');
    const dateRangeGroup = document.getElementById('batchDateRangeGroup');
    const startDateInput = document.getElementById('batchStartDate');
    const endDateInput = document.getElementById('batchEndDate');
    
    // 设置默认值
    permanentRadio.checked = true;
    temporaryRadio.checked = false;
    dateRangeGroup.style.display = 'none';
    
    // 清空日期输入
    startDateInput.value = '';
    endDateInput.value = '';
    
    // 清除错误状态
    clearBatchDateInputErrors();
    
    // 添加单选按钮事件监听器
    permanentRadio.addEventListener('change', function() {
        if (this.checked) {
            dateRangeGroup.style.display = 'none';
            clearBatchDateInputErrors();
        }
    });
    
    temporaryRadio.addEventListener('change', function() {
        if (this.checked) {
            dateRangeGroup.style.display = 'flex';
        }
    });
    
    // 添加日期输入框的实时校验
    startDateInput.addEventListener('input', validateBatchDateInputsRealTime);
    endDateInput.addEventListener('input', validateBatchDateInputsRealTime);
}

// 关闭批量授权弹窗
function closeBatchAuthModal() {
    const batchAuthSettingsModal = document.getElementById('batchAuthSettingsModal');
    if (batchAuthSettingsModal) {
        batchAuthSettingsModal.style.display = 'none';
    }
}

// 批量授权功能
function batchAuthorize() {
    const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
    const selectedIds = Array.from(checkedBoxes).map(checkbox => parseInt(checkbox.getAttribute('data-id')));
    
    if (selectedIds.length > 0) {
        // 获取授权设置
        const permanentRadio = document.getElementById('batchPermanentRadio');
        const startDateInput = document.getElementById('batchStartDate');
        const endDateInput = document.getElementById('batchEndDate');
        
        // 清除之前的错误提示
        clearBatchDateInputErrors();
        
        let isValid = true;
        
        // 验证表单
        if (!permanentRadio.checked) {
            if (!startDateInput.value) {
                startDateInput.classList.add('error');
                document.getElementById('batchStartDateError').textContent = '请选择开始日期';
                isValid = false;
            }
            
            if (!endDateInput.value) {
                endDateInput.classList.add('error');
                document.getElementById('batchEndDateError').textContent = '请选择结束日期';
                isValid = false;
            }
            
            // 如果是临时授权，验证日期
            if (startDateInput.value && endDateInput.value) {
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                const today = new Date().toISOString().split('T')[0];
                
                if (endDate <= startDate) {
                    startDateInput.classList.add('error');
                    endDateInput.classList.add('error');
                    // 添加红色闪烁效果
                    startDateInput.classList.add('flash-error');
                    endDateInput.classList.add('flash-error');
                    // 2秒后移除闪烁效果
                    setTimeout(() => {
                        startDateInput.classList.remove('flash-error');
                        endDateInput.classList.remove('flash-error');
                    }, 2000);
                    document.getElementById('batchStartDateError').textContent = '开始日期不能晚于结束日期';
                    isValid = false;
                }
                

            }
        }
        
        if (!isValid) {
            return;
        }
        
        // 应用设置到所有选中的资源
        selectedIds.forEach(id => {
            const resourceIndex = resourcesData.findIndex(item => item.id === id);
            
            if (resourceIndex !== -1) {
                // 更新资源的授权状态
                if (permanentRadio.checked) {
                    // 永久授权
                    resourcesData[resourceIndex].validity = {
                        type: 'permanent'
                    };
                } else {
                    // 临时授权
                    resourcesData[resourceIndex].validity = {
                        type: 'temporary',
                        startDate: startDateInput.value,
                        endDate: endDateInput.value
                    };
                }
            }
        });
        
        // 关闭弹窗
        closeBatchAuthModal();
        
        // 取消所有选中状态（在重新渲染表格之前）
        document.querySelectorAll('.app-checkbox:checked').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // 更新全选复选框状态
        updateSelectAllCheckboxState();
        
        // 隐藏批量按钮
        updateBatchActionButton();
        
        // 重新渲染表格
        renderResourceTable(resourceSearch.value, currentAppType);
        
        // 显示成功提示
        showToast('批量授权成功', 'success');
    }
}

// 批量取消授权功能
function batchRemoveAuthorize() {
    const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
    const selectedIds = Array.from(checkedBoxes).map(checkbox => parseInt(checkbox.getAttribute('data-id')));
    
    if (selectedIds.length > 0) {
        // 显示确认对话框
        const confirmText = document.querySelector('#removeAuthModal .confirm-text');
        if (confirmText) {
            confirmText.textContent = `批量操作：确定要取消这 ${selectedIds.length} 个选中资源的授权吗？`;
        }
        
        // 修改弹窗标题为批量取消授权
        const modalTitle = document.querySelector('#removeAuthModal .modal-header h2');
        if (modalTitle) {
            modalTitle.textContent = '批量取消授权';
        }
        
        // 显示取消授权确认弹窗
        const removeAuthModal = document.getElementById('removeAuthModal');
        if (removeAuthModal) {
            removeAuthModal.style.display = 'flex';
            
            // 修改确认按钮的点击事件
            const confirmBtn = document.getElementById('confirmRemoveAuthBtn');
            if (confirmBtn) {
                // 移除之前的事件监听器
                const newConfirmBtn = confirmBtn.cloneNode(true);
                confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
                
                // 添加新的事件监听器
                newConfirmBtn.addEventListener('click', function() {
                    // 应用设置到所有选中的应用
                    selectedIds.forEach(id => {
                        const resourceIndex = resourcesData.findIndex(item => item.id === id);
                        if (resourceIndex !== -1) {
                            // 更新为未授权状态
                            resourcesData[resourceIndex].validity = {
                                type: 'none',
                                startDate: null,
                                endDate: null
                            };
                        }
                    });
                    
                    // 重新渲染表格
                    renderResourceTable(resourceSearch.value, currentAppType);
                    
                    // 更新自己的标签页显示的授权数量
                    updateSelfTabAuthCount();
                    
                    // 关闭弹窗
                    removeAuthModal.style.display = 'none';
                    
                    // 取消所有选中状态
                    const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
                    checkedBoxes.forEach(checkbox => checkbox.checked = false);
                    
                    // 更新全选复选框状态
                    updateSelectAllCheckboxState();
                    
                    // 隐藏批量按钮
                    updateBatchActionButton();
                    
                    // 显示成功提示
                    showToast('批量取消授权成功', 'success');
                });
            }
        }
    }
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
            
            // 批量操作按钮的隐藏已由renderResourceTable函数处理
            
            // 重置资源表格的滚动条位置到最左侧
            document.querySelector('.resource-table').scrollLeft = 0;
        });
    });
}

// 渲染资源表格
function renderResourceTable(searchTerm = '', appType = 'web') {
    // 确保resourceTableBody存在
    if (!resourceTableBody) {
        resourceTableBody = ensureElement('resourceTableBody');
        if (!resourceTableBody) {
            return;
        }
    }
    
    // 首先强制隐藏批量操作按钮，避免初始化时显示问题
    let batchAuthBtnElement = document.getElementById('batchAuthBtn');
    let batchRemoveAuthBtnElement = document.getElementById('batchRemoveAuthBtn');
    if (batchAuthBtnElement) batchAuthBtnElement.style.display = 'none';
    if (batchRemoveAuthBtnElement) batchRemoveAuthBtnElement.style.display = 'none';
    
    // 清空表格 - 使用更安全的方式
    while (resourceTableBody.firstChild) {
        resourceTableBody.removeChild(resourceTableBody.firstChild);
    }
    
    // 重置全选复选框状态，确保清理旧状态
    let selectAllCheckboxElement = document.getElementById('selectAllApps');
    if (selectAllCheckboxElement) {
        selectAllCheckboxElement.checked = false;
    }
    
    // 清理可能残留的复选框状态
    document.querySelectorAll('.app-checkbox:checked').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 过滤数据
    let filteredData = [];
    
    // 根据应用类型过滤
    if (appType === 'web') {
        // 在web应用页面中显示前12条数据
        filteredData = resourcesData.slice(0, 12).filter(item => item !== undefined);
    } else if (appType === 'tunnel') {
        // 隧道应用显示部分授权数据
        filteredData = resourcesData.filter(item => 
            item && (item.name.includes('临时授权') || item.name.includes('永久') || item.icon === '组')
        ).slice(0, 5);
    } else if (appType === 'group') {
        // 组应用显示组合授权数据
        filteredData = resourcesData.filter(item => 
            item && item.icon === '组'
        );
    } else {
        // 默认显示所有数据
        filteredData = resourcesData.filter(item => item !== undefined);
    }
    
    // 根据搜索词过滤
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.url.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // 批量操作按钮已在函数开始时隐藏
    
    // 处理无数据情况
    if (filteredData.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 40px 20px;">
                <div style="color: #999; margin-bottom: 16px; font-size: 14px;">暂无授权信息</div>
                <button onclick="openAuthSettingsModal(null, 'add')" 
                        style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    新增授权
                </button>
            </td>
        `;
        resourceTableBody.appendChild(emptyRow);
        return;
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
        
        // 创建表格行内容
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'app-checkbox';
        checkbox.setAttribute('data-id', resource.id);
        // 不在这里添加事件监听器，使用表格级别的事件委托
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);
        
        // 图标单元格
        const iconCell = document.createElement('td');
        const iconContainer = document.createElement('div');
        iconContainer.className = 'app-icon-container';
        const icon = document.createElement('div');
        icon.className = `app-icon ${resource.iconColor}`;
        icon.textContent = resource.icon;
        iconContainer.appendChild(icon);
        iconCell.appendChild(iconContainer);
        row.appendChild(iconCell);
        
        // 名称单元格
        const nameCell = document.createElement('td');
        nameCell.textContent = resource.name;
        row.appendChild(nameCell);
        
        // URL单元格
        const urlCell = document.createElement('td');
        urlCell.textContent = resource.url;
        row.appendChild(urlCell);
        
        // 授权状态单元格
        const statusCell = document.createElement('td');
        const statusSpan = document.createElement('span');
        statusSpan.className = `validity-tag ${validityStatus}`;
        
        // 分离状态文本和时间信息
        let statusDisplayText = '';
        let timeInfo = '';
        
        if (validityText.includes('(')) {
            const parts = validityText.split('(');
            statusDisplayText = parts[0].trim();
            timeInfo = '(' + parts.slice(1).join('(');
        } else {
            statusDisplayText = validityText;
            timeInfo = '';
        }
        
        // 设置显示文本和hover提示
        statusSpan.textContent = statusDisplayText;
        if (timeInfo) {
            statusSpan.title = timeInfo;
        }
        
        statusCell.appendChild(statusSpan);
        row.appendChild(statusCell);
        
        // 操作单元格
        const actionCell = document.createElement('td');
        actionCell.className = 'action-column';
        
        // 操作按钮（编辑符号）
        const operationBtn = document.createElement('button');
        operationBtn.className = 'operation-btn';
        operationBtn.setAttribute('data-id', resource.id);
        operationBtn.innerHTML = `
            <svg stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        `; // 铅笔操作符号
        operationBtn.title = '授权详情';
        // 修复：点击操作时始终传递当前资源ID，由抽屉内部根据 otherAuth 决定展示内容，避免传递 otherAuth.id 造成空数据
        operationBtn.onclick = function() { 
            viewOtherAuth(resource.id);
        };
        actionCell.appendChild(operationBtn);
        
        row.appendChild(actionCell);
        
        resourceTableBody.appendChild(row);
        

    });
    
    // 添加授权设置按钮事件
    document.querySelectorAll('.settings-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const resourceId = parseInt(this.getAttribute('data-id'));
            openAuthSettingsModal(resourceId);
        });
    });
    
    // 全选复选框状态已在函数开始时重置
    
    // 根据复选框状态更新批量授权按钮显示
    updateBatchActionButton();
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
                showToast('已切换到总管理员视图', 'info');
            } else {
                showToast('已切换到' + this.options[this.selectedIndex].text + '视图', 'info');
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
            console.log('复选框状态变化，当前选中数量:', document.querySelectorAll('.app-checkbox:checked').length);
        }
    });
    
    // 监听表格中的按钮点击事件
    resourceTableBody.addEventListener('click', function(e) {
        // 新增授权按钮
        if (e.target && e.target.classList.contains('add-auth-btn')) {
            const resourceId = parseInt(e.target.getAttribute('data-id'));
            openAuthSettingsModal(resourceId, 'add');
        }
        
        // 取消授权按钮
        if (e.target && e.target.classList.contains('remove-auth-btn')) {
            const resourceId = parseInt(e.target.getAttribute('data-id'));
            openRemoveAuthModal(resourceId);
        }
        
        // 编辑授权按钮
        if (e.target && e.target.classList.contains('edit-auth-btn')) {
            const resourceId = parseInt(e.target.getAttribute('data-id'));
            openAuthSettingsModal(resourceId, 'edit');
        }
        
        // 查看其他授权按钮
        if (e.target && e.target.classList.contains('view-other-auth-btn')) {
            // 检查按钮是否被禁用
            if (!e.target.classList.contains('disabled')) {
                // 这里可以从按钮的data属性或其他方式获取authId
                // 由于当前实现中直接在onclick中调用，我们保持兼容
                if (e.target.onclick) {
                    e.target.onclick();
                }
            }
        }
    });
    
    // 移除原有的取消授权按钮事件监听器，因为我们已经创建了新的取消授权弹窗
    
    // 有效期类型切换
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'temporaryRadio') {
            if (e.target.checked) {
                const dateRangeGroup = document.getElementById('dateRangeGroup');
                const startDateInput = document.getElementById('startDate');
                const endDateInput = document.getElementById('endDate');
                
                dateRangeGroup.style.display = 'flex';
                // 设置默认的最小日期为今天
                const today = new Date().toISOString().split('T')[0];
                startDateInput.min = today;
                
                // 如果开始日期有值，设置结束日期的最小值为开始日期
                if (startDateInput.value) {
                    endDateInput.min = startDateInput.value;
                }
            }
        }
    });
    
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
            // 清空日期输入框的值
            startDateInput.value = '';
            endDateInput.value = '';
            // 清除日期输入框的错误状态
            clearDateInputErrors();
        }
    });
    
    // 日期输入框联动验证
    startDateInput.addEventListener('change', function() {
        validateDateInputsRealTime();
        
        // 设置结束日期的最小值为开始日期
        endDateInput.min = this.value;
        
        // 如果结束日期早于开始日期，则清空结束日期
        if (endDateInput.value && endDateInput.value < this.value) {
            endDateInput.value = '';
        }
    });
    
    endDateInput.addEventListener('change', function() {
        validateDateInputsRealTime();
        
        // 如果开始日期为空，而结束日期有值，则设置开始日期的最大值为结束日期
        if (!startDateInput.value && this.value) {
            startDateInput.max = this.value;
        }
    });
    
    // 添加实时校验功能
    startDateInput.addEventListener('blur', function() {
        if (temporaryRadio.checked && !this.value) {
            this.classList.add('error');
            showToast('请选择开始日期', 'error');
        }
    });
    
    endDateInput.addEventListener('blur', function() {
        if (temporaryRadio.checked && !this.value) {
            this.classList.add('error');
            showToast('请选择结束日期', 'error');
        }
    });
    
    // 保存授权设置
    saveAuthBtn.addEventListener('click', saveAuthSettings);
    
    // 搜索功能
    resourceSearch.addEventListener('input', function() {
        renderResourceTable(this.value, currentAppType);
        

        
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
            
            // 隐藏批量操作按钮
            const batchAuthBtn = document.getElementById('batchAuthBtn');
            const batchRemoveAuthBtn = document.getElementById('batchRemoveAuthBtn');
            if (batchAuthBtn) batchAuthBtn.style.display = 'none';
            if (batchRemoveAuthBtn) batchRemoveAuthBtn.style.display = 'none';
            
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
            
            // 隐藏批量操作按钮
            const batchAuthBtn = document.getElementById('batchAuthBtn');
            const batchRemoveAuthBtn = document.getElementById('batchRemoveAuthBtn');
            if (batchAuthBtn) batchAuthBtn.style.display = 'none';
            if (batchRemoveAuthBtn) batchRemoveAuthBtn.style.display = 'none';
            
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
            
            // 隐藏批量操作按钮
            const batchAuthBtn = document.getElementById('batchAuthBtn');
            const batchRemoveAuthBtn = document.getElementById('batchRemoveAuthBtn');
            if (batchAuthBtn) batchAuthBtn.style.display = 'none';
            if (batchRemoveAuthBtn) batchRemoveAuthBtn.style.display = 'none';
            
            // 重置资源表格的滚动条位置到最左侧
            document.querySelector('.resource-table').scrollLeft = 0;
        });
    });
}

// 打开取消授权确认弹窗
function openRemoveAuthModal(resourceId) {
    const resource = resourcesData.find(item => item.id === resourceId);
    if (!resource) return;
    
    currentEditingId = resourceId;
    
    // 设置弹窗标题为取消授权
    const modalTitle = document.querySelector('#removeAuthModal .modal-header h2');
    if (modalTitle) {
        modalTitle.textContent = '取消授权';
    }
    
    // 显示取消授权弹窗
    const removeAuthModal = document.getElementById('removeAuthModal');
    removeAuthModal.style.display = 'flex';
    
    // 更新确认文本
    const confirmText = document.querySelector('#removeAuthModal .confirm-text');
    if (confirmText) {
        confirmText.textContent = `确定要取消授权吗？`;
    }
}

// 关闭取消授权弹窗
function closeRemoveAuthModal() {
    const removeAuthModal = document.getElementById('removeAuthModal');
    removeAuthModal.style.display = 'none';
    currentEditingId = null;
}

// 打开授权设置弹窗
function openAuthSettingsModal(resourceId, mode = 'add') {
    const resource = resourcesData.find(item => item.id === resourceId);
    if (!resource) return;
    
    currentEditingId = resourceId;
    currentEditingMode = mode;
    
    // 保存原始日期值（用于编辑模式下的校验）
    if (mode === 'edit' && resource.validity.type === 'temporary') {
        originalStartDate = resource.validity.startDate;
        originalEndDate = resource.validity.endDate;
    } else {
        originalStartDate = null;
        originalEndDate = null;
    }
    
    // 判断授权状态
    const isAuthorized = resource.validity && (resource.validity.type === 'permanent' || 
        (resource.validity.type === 'temporary' && 
         resource.validity.startDate && resource.validity.endDate));
    
    // 获取授权内容区域
    const authContent = document.getElementById('authSettingsContent');
    
    // 设置弹窗标题
    const authModalTitle = document.getElementById('authModalTitle');
    
    // 重置按钮状态
    saveAuthBtn.style.display = 'none';
    saveAuthBtn.style.visibility = 'hidden';
    saveAuthBtn.style.opacity = '0';
    removeAuthBtn.style.display = 'none';
    removeAuthBtn.style.visibility = 'hidden';
    removeAuthBtn.style.opacity = '0';
    
    // 设置授权内容
        authContent.innerHTML = `
            <div class="form-group">
                <label>授权有效期：</label>
                <div class="radio-group">
                    <div class="radio-item">
                        <input type="radio" id="permanentRadio" name="validityType" value="permanent" checked>
                        <label for="permanentRadio">永久有效</label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" id="temporaryRadio" name="validityType" value="temporary">
                        <label for="temporaryRadio">设置有效期</label>
                    </div>
                </div>
            </div>
            <div class="form-group date-range" id="dateRangeGroup" style="display: none;">
                <div class="date-input">
                    <label>开始日期：</label>
                    <input type="date" id="startDate">
                </div>
                <div class="date-input">
                    <label>结束日期：</label>
                    <input type="date" id="endDate">
                </div>
            </div>
        `;
        
        // 添加单选按钮事件监听器
        document.getElementById('permanentRadio').addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('dateRangeGroup').style.display = 'none';
            }
        });
        
        document.getElementById('temporaryRadio').addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('dateRangeGroup').style.display = 'flex';
            }
        });
        
        // 重新获取元素引用
        dateRangeGroup = document.getElementById('dateRangeGroup');
        startDateInput = document.getElementById('startDate');
        endDateInput = document.getElementById('endDate');
        permanentRadio = document.getElementById('permanentRadio');
        temporaryRadio = document.getElementById('temporaryRadio');
        
        if (mode === 'add') {
            // 新增授权
            authModalTitle.textContent = '新增授权';
            
            // 默认选择永久有效
            permanentRadio.checked = true;
            temporaryRadio.checked = false;
            dateRangeGroup.style.display = 'none';
            
            // 清空日期输入框的值
            startDateInput.value = '';
            endDateInput.value = '';
            
            // 只显示确定按钮
            saveAuthBtn.style.display = 'inline-block';
            saveAuthBtn.style.visibility = 'visible';
            saveAuthBtn.style.opacity = '1';
            removeAuthBtn.style.display = 'none';
            removeAuthBtn.style.visibility = 'hidden';
            removeAuthBtn.style.opacity = '0';
        } else if (mode === 'edit') {
            // 编辑授权
            authModalTitle.textContent = '编辑授权';
            
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
            
            // 只显示确定按钮，隐藏取消授权按钮
            saveAuthBtn.style.display = 'inline-block';
            saveAuthBtn.style.visibility = 'visible';
            saveAuthBtn.style.opacity = '1';
            removeAuthBtn.style.display = 'none';
            removeAuthBtn.style.visibility = 'hidden';
            removeAuthBtn.style.opacity = '0';
            
            // 不在这里调用 updateBatchActionButton()，避免在没有复选框选中时错误显示批量授权按钮
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
    
    // 检查是否有选中的复选框，只有在有选中的复选框时才更新批量授权按钮
    const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
    if (checkedBoxes.length > 0) {
        updateBatchActionButton();
    }
}

// 保存授权设置
// 清除日期输入框的错误状态
function clearDateInputErrors() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    if (startDateInput) startDateInput.classList.remove('error');
    if (endDateInput) endDateInput.classList.remove('error');
    const startDateError = document.getElementById('startDateError');
    const endDateError = document.getElementById('endDateError');
    if (startDateError) startDateError.textContent = '';
    if (endDateError) endDateError.textContent = '';
}

// 清除批量日期输入框的错误状态
function clearBatchDateInputErrors() {
    const batchStartDate = document.getElementById('batchStartDate');
    const batchEndDate = document.getElementById('batchEndDate');
    batchStartDate.classList.remove('error');
    batchEndDate.classList.remove('error');
    document.getElementById('batchStartDateError').textContent = '';
    document.getElementById('batchEndDateError').textContent = '';
}

// 批量日期输入框实时验证
function validateBatchDateInputsRealTime() {
    // 清除错误状态
    clearBatchDateInputErrors();
    
    const temporaryRadio = document.getElementById('batchTemporaryRadio');
    const startDateInput = document.getElementById('batchStartDate');
    const endDateInput = document.getElementById('batchEndDate');
    
    if (temporaryRadio.checked) {
        // 验证开始日期不能晚于结束日期
        if (startDateInput.value && endDateInput.value && startDateInput.value > endDateInput.value) {
            startDateInput.classList.add('error');
            endDateInput.classList.add('error');
            document.getElementById('batchStartDateError').textContent = '开始日期不能晚于结束日期';
        }
        

    }
}

// 实时验证日期输入
function validateDateInputsRealTime() {
    // 清除错误状态
    clearDateInputErrors();
    
    const temporaryRadio = document.getElementById('temporaryRadio');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (temporaryRadio && temporaryRadio.checked && startDateInput && endDateInput) {
        // 验证开始日期不能晚于结束日期
        if (startDateInput.value && endDateInput.value && startDateInput.value > endDateInput.value) {
            startDateInput.classList.add('error');
            endDateInput.classList.add('error');
            document.getElementById('startDateError').textContent = '开始日期不能晚于结束日期';
        }
        
        // 验证日期不能是过去的日期（编辑模式下允许保留原有日期）
        const today = new Date().toISOString().split('T')[0];
        
        // 日期校验逻辑已移除
    }
}

// 验证日期输入并显示视觉提示
function validateDateInputs() {
    clearDateInputErrors();
    
    const temporaryRadio = document.getElementById('temporaryRadio');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    let isValid = true;
    
    // 验证日期输入
    if (temporaryRadio && temporaryRadio.checked && startDateInput && endDateInput) {
        if (!startDateInput.value) {
            startDateInput.classList.add('error');
            document.getElementById('startDateError').textContent = '请选择开始日期';
            isValid = false;
        }
        
        if (!endDateInput.value) {
            endDateInput.classList.add('error');
            document.getElementById('endDateError').textContent = '请选择结束日期';
            isValid = false;
        }
        
        // 验证开始日期不能晚于结束日期
        if (startDateInput.value && endDateInput.value && startDateInput.value > endDateInput.value) {
            startDateInput.classList.add('error');
            endDateInput.classList.add('error');
            document.getElementById('startDateError').textContent = '开始日期不能晚于结束日期';
            isValid = false;
        }
        
        // 日期早于今天的验证逻辑已移除
    }
    
    return isValid;
}

function saveAuthSettings() {
    if (currentEditingId === null) return;
    
    const resourceIndex = resourcesData.findIndex(item => item.id === currentEditingId);
    if (resourceIndex === -1) return;
    
    const permanentRadio = document.getElementById('permanentRadio');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (currentEditingMode === 'add') {
        // 新增授权模式
        const resource = resourcesData[resourceIndex];
        
        if (permanentRadio && permanentRadio.checked) {
            // 永久授权
            if (resource.validity.type === 'unauthorized') {
                resource.validity = {
                    type: 'permanent',
                    startDate: null,
                    endDate: null
                };
                resource.icon = '永';
                resource.iconColor = 'blue';
            } else if (resource.validity.type === 'permanent') {
                // 已经是永久授权，转换为组合授权（添加新的永久授权）
                resource.validity = {
                    type: 'combined',
                    periods: [{ type: 'permanent' }, { type: 'permanent' }]
                };
                resource.icon = '组';
                resource.iconColor = 'green';
            } else if (resource.validity.type === 'temporary' && !resource.validity.periods) {
                // 单时间段转为组合授权（包含永久）
                const originalPeriod = {
                    startDate: resource.validity.startDate,
                    endDate: resource.validity.endDate
                };
                resource.validity = {
                    type: 'combined',
                    periods: [originalPeriod, { type: 'permanent' }]
                };
                resource.icon = '组';
                resource.iconColor = 'green';
            } else if (resource.validity.periods) {
                // 已经是组合授权，添加永久授权
                resource.validity.periods.push({ type: 'permanent' });
                resource.validity.type = 'combined';
                resource.iconColor = 'green';
            }
        } else {
            // 临时授权
            // 验证日期输入
            if (!validateDateInputs()) {
                if (startDateInput && endDateInput && (!startDateInput.value || !endDateInput.value)) {
                    showToast('请同时设置开始日期和结束日期', 'error');
                } else if (startDateInput && endDateInput && startDateInput.value > endDateInput.value) {
                    startDateInput.classList.remove('flash-error');
                    endDateInput.classList.remove('flash-error');
                    setTimeout(() => {
                        startDateInput.classList.add('flash-error');
                        endDateInput.classList.add('flash-error');
                    }, 10);
                    
                    setTimeout(() => {
                        startDateInput.classList.remove('flash-error');
                        endDateInput.classList.remove('flash-error');
                    }, 2000);
                    
                    showToast('开始日期不能晚于结束日期', 'error');
                }
                return;
            }
            
            const newPeriod = {
                startDate: startDateInput.value,
                endDate: endDateInput.value
            };
            
            if (resource.validity.type === 'unauthorized') {
                // 未授权状态，直接设置为临时授权
                resource.validity = {
                    type: 'temporary',
                    startDate: newPeriod.startDate,
                    endDate: newPeriod.endDate
                };
                resource.icon = '单';
                resource.iconColor = 'green';
            } else if (resource.validity.type === 'permanent') {
                // 永久授权转为组合授权（包含临时）
                resource.validity = {
                    type: 'combined',
                    periods: [{ type: 'permanent' }, newPeriod]
                };
                resource.icon = '组';
                resource.iconColor = 'green';
            } else if (resource.validity.type === 'temporary' && !resource.validity.periods) {
                // 单时间段授权，转换为组合授权
                const originalPeriod = {
                    startDate: resource.validity.startDate,
                    endDate: resource.validity.endDate
                };
                resource.validity = {
                    type: 'temporary',
                    periods: [originalPeriod, newPeriod]
                };
                resource.icon = '组';
                resource.iconColor = 'purple';
            } else if (resource.validity.periods) {
                // 已经是组合授权，添加新的时间段
                resource.validity.periods.push(newPeriod);
            }
        }
        
        // 隐藏新增按钮
        const addAuthContainer = document.getElementById('addAuthContainer');
        if (addAuthContainer) {
            addAuthContainer.style.display = 'none';
        }
        
        // 重新加载抽屉内容
        viewOtherAuth(currentEditingId);
        
        showToast('应用授权已更新', 'success');
    } else {
        // 编辑授权模式
        if (permanentRadio && permanentRadio.checked) {
            resourcesData[resourceIndex].validity = {
                type: 'permanent',
                startDate: null,
                endDate: null
            };
        } else {
            // 验证日期输入
            if (!validateDateInputs()) {
                if (startDateInput && endDateInput && (!startDateInput.value || !endDateInput.value)) {
                    showToast('请同时设置开始日期和结束日期', 'error');
                } else if (startDateInput && endDateInput && startDateInput.value > endDateInput.value) {
                    startDateInput.classList.remove('flash-error');
                    endDateInput.classList.remove('flash-error');
                    setTimeout(() => {
                        startDateInput.classList.add('flash-error');
                        endDateInput.classList.add('flash-error');
                    }, 10);
                    
                    setTimeout(() => {
                        startDateInput.classList.remove('flash-error');
                        endDateInput.classList.remove('flash-error');
                    }, 2000);
                    
                    showToast('开始日期不能晚于结束日期', 'error');
                }
                return;
            }
            
            resourcesData[resourceIndex].validity = {
                type: 'temporary',
                startDate: startDateInput ? startDateInput.value : null,
                endDate: endDateInput ? endDateInput.value : null
            };
        }
        
        showToast('应用授权已更新', 'success');
    }
    
    // 重新渲染表格
    renderResourceTable(resourceSearch.value, currentAppType);
    
    // 更新自己的标签页显示的授权数量
    updateSelfTabAuthCount();
    
    // 关闭弹窗
    closeModal();
}

// 取消授权
function removeAuth() {
    if (currentEditingId === null) return;
    
    const resourceIndex = resourcesData.findIndex(item => item.id === currentEditingId);
    if (resourceIndex === -1) return;
    
    // 设置为无授权状态
    resourcesData[resourceIndex].validity = {
        type: 'none',
        startDate: null,
        endDate: null
    };
    
    // 重新渲染表格
    renderResourceTable(resourceSearch.value, currentAppType);
    
    // 更新自己的标签页显示的授权数量
    updateSelfTabAuthCount();
    
    // 关闭取消授权弹窗
    closeRemoveAuthModal();
    
    // 显示成功提示
    showToast('已取消授权', 'success');
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

// 获取授权有效期显示文本的辅助函数
function getValidityDisplayText(validity) {
    if (validity.type === 'permanent') {
        return '永久授权';
    } else if (validity.type === 'temporary') {
        if (validity.startDate && validity.endDate) {
            return `${validity.startDate} 至 ${validity.endDate}`;
        }
    } else if (validity.type === 'unauthorized') {
        return '未授权';
    }
    return '未知状态';
}

// 全局变量用于管理编辑状态
let editingRowIndex = null;
let originalRowData = null;
let currentAuthData = [];
let currentResourceId = null;

function viewOtherAuth(authId) {
    // 获取抽屉式弹窗元素
    const otherAuthDrawer = document.getElementById('otherAuthDrawer');
    
    // 重置编辑状态
    editingRowIndex = null;
    originalRowData = null;
    currentResourceId = authId;
    
    // 查找对应的资源数据
    const resource = resourcesData.find(r => r.id == authId);
    
    if (resource) {
        // 检查是否为未授权状态
        const isUnauthorized = resource.validity.type === 'unauthorized';
        
        if (isUnauthorized) {
            // 如果是未授权状态，显示空状态信息
            currentAuthData = [];
            // 调用renderAuthTable来正确显示新增按钮
            renderAuthTable();
        } else {
            // 如果已有授权，显示当前资源的授权信息
            const creators = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
            const roles = ['总管理员', '部门管理员', '项目管理员', '子管理员'];
            
            currentAuthData = [];
            
            // 检查是否为组合授权
            if (resource.validity.type === 'combined' || resource.validity.periods) {
                // 组合授权：显示多条授权记录
                if (resource.validity.periods) {
                    resource.validity.periods.forEach((period, index) => {
                        // 根据period对象中的isDirect属性判断授权类型
                        // 授权类型应该是固定属性，不应该基于动态索引判断
                        let authType;
                        if (period.isDirect === true) {
                            authType = 'direct';
                        } else if (period.isDirect === false) {
                            authType = 'indirect';
                        } else {
                            // 如果数据中没有isDirect属性，说明数据有问题
                            // 这种情况下应该报错或者有明确的默认处理
                            console.warn('Period对象缺少isDirect属性:', period);
                            authType = 'indirect'; // 默认为间接授权，避免误判
                        }
                        if (period.type === 'permanent') {
                            currentAuthData.push({
                                appName: resource.name,
                                subject: currentEntity,
                                validity: '永久授权',
                                validityType: 'permanent',
                                startDate: null,
                                endDate: null,
                                creator: creators[Math.floor(Math.random() * creators.length)],
                                role: roles[Math.floor(Math.random() * roles.length)],
                                type: authType,
                                periodIndex: index
                            });
                        } else {
                            currentAuthData.push({
                                appName: resource.name,
                                subject: currentEntity,
                                validity: `${period.startDate} 至 ${period.endDate}`,
                                validityType: 'temporary',
                                startDate: period.startDate,
                                endDate: period.endDate,
                                creator: creators[Math.floor(Math.random() * creators.length)],
                                role: roles[Math.floor(Math.random() * roles.length)],
                                type: authType,
                                periodIndex: index
                            });
                        }
                    });
                }
            } else {
                // 单个授权：显示一条授权记录
                const validityType = resource.validity.type;
                // 单个授权默认为直接授权，因为它是当前主体对当前资源的直接授权
                const authType = 'direct';
                currentAuthData.push({
                    appName: resource.name,
                    subject: currentEntity,
                    validity: getValidityDisplayText(resource.validity),
                    validityType: validityType,
                    startDate: resource.validity.startDate,
                    endDate: resource.validity.endDate,
                    creator: creators[Math.floor(Math.random() * creators.length)],
                    role: roles[Math.floor(Math.random() * roles.length)],
                    type: authType
                });
            }
            
            // 渲染表格
            renderAuthTable();
        }
    } else {
        // 显示空状态信息
        currentAuthData = [];
        renderAuthTable();
    }
    
    // 初始化新增授权按钮事件
    const addAuthBtn = document.getElementById('addAuthBtn');
    if (addAuthBtn) {
        // 移除之前的事件监听器
        addAuthBtn.replaceWith(addAuthBtn.cloneNode(true));
        const newAddAuthBtn = document.getElementById('addAuthBtn');
        
        newAddAuthBtn.addEventListener('click', function() {
            addNewAuthRow();
        });
    }
    
    // 显示弹窗
    otherAuthDrawer.classList.add('active');
}

// 渲染授权表格
function renderAuthTable() {
    const directAuthTableBody = document.getElementById('directAuthTableBody');
    const indirectAuthTableBody = document.getElementById('indirectAuthTableBody');
    const directAuthCount = document.getElementById('directAuthCount');
    const indirectAuthCount = document.getElementById('indirectAuthCount');
    
    // 清空表格内容
    directAuthTableBody.innerHTML = '';
    indirectAuthTableBody.innerHTML = '';
    
    // 分组授权数据
    const directAuths = currentAuthData.filter(auth => auth.type === 'direct');
    const indirectAuths = currentAuthData.filter(auth => auth.type === 'indirect');
    
    // 更新统计信息
    directAuthCount.textContent = `${directAuths.length}条`;
    indirectAuthCount.textContent = `${indirectAuths.length}条`;
    
    // 渲染直接授权表格
    if (directAuths.length === 0 && editingRowIndex === null) {
        // 当没有直接授权且没有正在编辑时，显示新增授权按钮
        const addRow = document.createElement('tr');
        addRow.className = 'add-auth-row';
        addRow.innerHTML = `
            <td colspan="6" class="add-auth-cell">
                <button class="add-auth-btn" onclick="addNewAuthRow()">+ 新增授权</button>
            </td>
        `;
        directAuthTableBody.appendChild(addRow);
    } else {
        directAuths.forEach((auth, index) => {
            const globalIndex = currentAuthData.indexOf(auth);
            const row = createAuthRow(auth, globalIndex);
            directAuthTableBody.appendChild(row);
        });
    }
    
    // 渲染间接授权表格
    if (indirectAuths.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="empty-auth-cell" style="text-align: center; color: #999; padding: 20px;">
                暂无间接授权
            </td>
        `;
        indirectAuthTableBody.appendChild(emptyRow);
    } else {
        indirectAuths.forEach((auth, index) => {
            const globalIndex = currentAuthData.indexOf(auth);
            const row = createAuthRow(auth, globalIndex, false); // 间接授权也可以编辑
            indirectAuthTableBody.appendChild(row);
        });
    }
    
    // 隐藏底部新增按钮（使用表格内第一行按钮代替）
    const addAuthContainer = document.getElementById('addAuthContainer');
    if (addAuthContainer) {
        addAuthContainer.style.display = 'none';
    }
}

// 创建授权行的辅助函数
function createAuthRow(auth, index, isReadOnly = false) {
    const row = document.createElement('tr');
    row.setAttribute('data-row-index', index);
    
    if (editingRowIndex === index && !isReadOnly) {
        // 编辑模式（仅直接授权可编辑）
        row.innerHTML = `
            <td>${auth.appName}</td>
            <td>${auth.subject}</td>
            <td>
                <div class="edit-validity-container">
                    <div class="radio-group-inline">
                        <label class="radio-inline">
                            <input type="radio" name="editValidityType_${index}" value="permanent" ${auth.validityType === 'permanent' ? 'checked' : ''}>
                            永久有效
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="editValidityType_${index}" value="temporary" ${auth.validityType === 'temporary' ? 'checked' : ''}>
                            设置有效期
                        </label>
                    </div>
                    <div class="date-inputs" id="editDateInputs_${index}" style="${auth.validityType === 'permanent' ? 'display: none;' : 'display: block;'}">
                        <input type="date" id="editStartDate_${index}" value="${auth.startDate || ''}" class="date-input-small">
                        <span>至</span>
                        <input type="date" id="editEndDate_${index}" value="${auth.endDate || ''}" class="date-input-small">
                    </div>
                </div>
            </td>
            <td>
                <span class="readonly-field">${auth.creator}</span>
            </td>
            <td>
                <span class="readonly-field">${auth.role}</span>
            </td>
            <td>
                <button class="save-auth-btn" onclick="saveEditingRow(${index})" style="color: #28a745; background: none; border: none; cursor: pointer; margin-right: 8px;">保存修改</button>
                <button class="cancel-auth-btn" onclick="cancelEditingRow(${index})" style="color: #6c757d; background: none; border: none; cursor: pointer;">取消修改</button>
            </td>
        `;
        
        // 添加事件监听器
        setTimeout(() => {
            const permanentRadio = row.querySelector(`input[name="editValidityType_${index}"][value="permanent"]`);
            const temporaryRadio = row.querySelector(`input[name="editValidityType_${index}"][value="temporary"]`);
            const dateInputs = row.querySelector(`#editDateInputs_${index}`);
            
            if (permanentRadio && temporaryRadio && dateInputs) {
                permanentRadio.addEventListener('change', () => {
                    if (permanentRadio.checked) {
                        dateInputs.style.display = 'none';
                    }
                });
                
                temporaryRadio.addEventListener('change', () => {
                    if (temporaryRadio.checked) {
                        dateInputs.style.display = 'block';
                    }
                });
            }
        }, 0);
    } else {
        // 显示模式 - 间接授权和直接授权都使用行内编辑
        const actionButtons = `<button class="edit-auth-btn" onclick="startEditingRow(${index})" style="color: #007bff; background: none; border: none; cursor: pointer; margin-right: 8px;">编辑有效期</button><button class="remove-auth-btn" onclick="removeAuthRow(${index}, '${auth.type}', ${currentResourceId})" style="color: #dc3545; background: none; border: none; cursor: pointer;">取消授权</button>`;
        
        row.innerHTML = `
            <td>${auth.appName}</td>
            <td>${auth.subject}</td>
            <td>${auth.validity}</td>
            <td>${auth.creator}</td>
            <td>${auth.role}</td>
            <td>${actionButtons}</td>
        `;
    }
    
    return row;
}

// 开始编辑行
function startEditingRow(index) {
    // 如果已有其他行在编辑，先取消
    if (editingRowIndex !== null && editingRowIndex !== index) {
        cancelEditingRow(editingRowIndex);
    }
    
    // 保存原始数据
    originalRowData = { ...currentAuthData[index] };
    editingRowIndex = index;
    
    // 重新渲染表格
    renderAuthTable();
}

// 保存编辑的行
function saveEditingRow(index) {
    const row = document.querySelector(`tr[data-row-index="${index}"]`);
    if (!row) return;
    
    // 获取编辑后的数据
    const validityType = row.querySelector(`input[name="editValidityType_${index}"]:checked`)?.value;
    const startDate = row.querySelector(`#editStartDate_${index}`)?.value;
    const endDate = row.querySelector(`#editEndDate_${index}`)?.value;
    
    // 验证数据
    if (validityType === 'temporary') {
        if (!startDate || !endDate) {
            showToast('请选择开始日期和结束日期', 'error');
            return;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            showToast('开始日期必须早于结束日期', 'error');
            return;
        }
    }
    
    // 更新currentAuthData中的数据
    currentAuthData[index] = {
        ...currentAuthData[index],
        validityType: validityType,
        startDate: validityType === 'permanent' ? null : startDate,
        endDate: validityType === 'permanent' ? null : endDate,
        validity: validityType === 'permanent' ? '永久授权' : `${startDate} 至 ${endDate}`
    };
    
    // 同步更新resourcesData中的原始数据
    const resourceIndex = resourcesData.findIndex(r => r.id == currentResourceId);
    if (resourceIndex !== -1) {
        const resource = resourcesData[resourceIndex];
        const authData = currentAuthData[index];
        
        // 检查是否为新增授权（通过originalRowData判断）
        const isNewAuth = originalRowData && originalRowData.appName && originalRowData.creator === '张三' && originalRowData.role === '总管理员';
        
        if (isNewAuth && index === 0) {
            // 新增授权的情况
            if (resource.validity.type === 'unauthorized') {
                // 从未授权状态添加第一个授权
                if (validityType === 'permanent') {
                    resource.validity = {
                        type: 'permanent',
                        startDate: null,
                        endDate: null
                    };
                    resource.icon = '永';
                    resource.iconColor = 'blue';
                } else {
                    resource.validity = {
                        type: 'temporary',
                        startDate: startDate,
                        endDate: endDate
                    };
                    resource.icon = '单';
                    resource.iconColor = 'green';
                }
            } else if (resource.validity.type === 'permanent' || resource.validity.type === 'temporary') {
                // 已有单个授权，转换为组合授权
                const existingPeriod = resource.validity.type === 'permanent' 
                    ? { type: 'permanent' }
                    : { startDate: resource.validity.startDate, endDate: resource.validity.endDate };
                
                const newPeriod = validityType === 'permanent'
                    ? { type: 'permanent' }
                    : { startDate: startDate, endDate: endDate };
                
                resource.validity = {
                    type: 'combined',
                    periods: [newPeriod, existingPeriod]
                };
                resource.icon = '组';
                resource.iconColor = 'green';
            } else if (resource.validity.periods) {
                // 已经是组合授权，添加新的时间段到开头
                const newPeriod = validityType === 'permanent'
                    ? { type: 'permanent' }
                    : { startDate: startDate, endDate: endDate };
                
                resource.validity.periods.unshift(newPeriod);
            }
        } else {
            // 编辑现有授权的情况
            // 如果是直接授权（第一条记录且type为direct）
            if (index === 0 && authData.type === 'direct') {
                if (resource.validity.periods) {
                    // 组合授权：更新第一个时间段
                    if (validityType === 'permanent') {
                        resource.validity.periods[0] = { type: 'permanent' };
                    } else {
                        resource.validity.periods[0] = { startDate: startDate, endDate: endDate };
                    }
                    
                    // 检查是否包含永久授权，如果是则更新validity.type为combined
                    const hasPermanent = resource.validity.periods.some(period => period.type === 'permanent');
                    if (hasPermanent) {
                        resource.validity.type = 'combined';
                        resource.icon = '组';
                        resource.iconColor = 'green';
                    } else {
                        // 如果没有永久授权，保持为temporary类型
                        resource.validity.type = 'temporary';
                        resource.icon = '组';
                        resource.iconColor = 'blue';
                    }
                } else {
                    // 单个授权：直接更新validity和图标
                    if (validityType === 'permanent') {
                        resource.validity = {
                            type: 'permanent',
                            startDate: null,
                            endDate: null
                        };
                        resource.icon = '永';
                        resource.iconColor = 'blue';
                    } else {
                        resource.validity = {
                            type: 'temporary',
                            startDate: startDate,
                            endDate: endDate
                        };
                        resource.icon = '单';
                        resource.iconColor = 'blue';
                    }
                }
            } else if (authData.type === 'indirect' && resource.validity.periods) {
                // 间接授权：计算正确的时间段索引
                const directAuthCount = currentAuthData.filter(auth => auth.type === 'direct').length;
                const indirectIndex = index - directAuthCount;
                
                if (resource.validity.periods[indirectIndex]) {
                    if (validityType === 'permanent') {
                        resource.validity.periods[indirectIndex] = { type: 'permanent' };
                    } else {
                        resource.validity.periods[indirectIndex] = { startDate: startDate, endDate: endDate };
                    }
                    
                    // 检查是否包含永久授权，如果是则更新validity.type为combined
                    const hasPermanent = resource.validity.periods.some(period => period.type === 'permanent');
                    if (hasPermanent) {
                        resource.validity.type = 'combined';
                        resource.icon = '组';
                        resource.iconColor = 'green';
                    } else {
                        // 如果没有永久授权，保持为temporary类型
                        resource.validity.type = 'temporary';
                        resource.icon = '组';
                        resource.iconColor = 'blue';
                    }
                }
            }
        }
        
        // 重新渲染主表格以反映变化
        renderResourceTable(document.getElementById('resourceSearch').value, currentAppType);
    }
    
    // 重置编辑状态
    editingRowIndex = null;
    originalRowData = null;
    
    // 重新渲染表格
    renderAuthTable();
    
    // 显示成功消息
    showToast('应用授权已更新', 'success');
}

// 取消编辑行
function cancelEditingRow(index) {
    // 恢复原始数据
    if (originalRowData) {
        currentAuthData[index] = { ...originalRowData };
    }
    
    // 重置编辑状态
    editingRowIndex = null;
    originalRowData = null;
    
    // 重新渲染表格
    renderAuthTable();
}

// 添加新授权行
function addNewAuthRow() {
    // 检查是否已有直接授权
    const hasDirectAuth = currentAuthData.some(auth => auth.type === 'direct');
    if (hasDirectAuth) {
        showToast('直接授权最多只能有一条，请先删除现有直接授权', 'warning');
        return;
    }
    
    // 如果有行正在编辑，先保存或取消
    if (editingRowIndex !== null) {
        if (!confirmUnsavedChanges()) {
            return;
        }
    }
    
    // 获取当前资源信息
    const currentResource = resourcesData.find(r => r.id == currentResourceId);
    const appName = currentResource ? currentResource.name : '新应用';
    
    // 创建新的授权数据
    const newAuth = {
        appName: appName,
        subject: currentEntity,
        validity: '永久授权',
        validityType: 'permanent',
        startDate: null,
        endDate: null,
        creator: '张三',
        role: '总管理员',
        type: 'direct'
    };
    
    // 添加到数据数组顶部
    currentAuthData.unshift(newAuth);
    
    // 设置新行为编辑状态（第一行）
    editingRowIndex = 0;
    originalRowData = { ...newAuth };
    
    // 重新渲染表格
    renderAuthTable();
    
    // 滚动到新行并聚焦第一个输入框
    setTimeout(() => {
        const newRow = document.querySelector(`tr[data-row-index="${editingRowIndex}"]`);
        if (newRow) {
            newRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // 聚焦到第一个可编辑元素
            const firstInput = newRow.querySelector('input[type="radio"]:checked');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }, 100);
    
    // 显示提示信息
    showToast('已添加新授权，请编辑后保存', 'info');
}

// 确认未保存的更改
function confirmUnsavedChanges() {
    if (editingRowIndex === null) return true;
    
    const result = confirm('您做的修改尚未保存，确认退出吗？');
    if (result) {
        // 放弃更改
        cancelEditingRow(editingRowIndex);
        return true;
    }
    return false;
}

// 静默保存编辑行（不显示成功消息）
function saveEditingRowSilent(index) {
    const row = document.querySelector(`tr[data-row-index="${index}"]`);
    if (!row) return false;
    
    // 获取编辑后的数据
    const validityType = row.querySelector(`input[name="editValidityType_${index}"]:checked`)?.value;
    const startDate = row.querySelector(`#editStartDate_${index}`)?.value;
    const endDate = row.querySelector(`#editEndDate_${index}`)?.value;
    
    // 验证数据
    if (validityType === 'temporary') {
        if (!startDate || !endDate) {
            return false;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            return false;
        }
    }
    
    // 更新数据
    currentAuthData[index] = {
        ...currentAuthData[index],
        validityType: validityType,
        startDate: validityType === 'permanent' ? null : startDate,
        endDate: validityType === 'permanent' ? null : endDate,
        validity: validityType === 'permanent' ? '永久授权' : `${startDate} 至 ${endDate}`
    };
    
    // 重置编辑状态
    editingRowIndex = null;
    originalRowData = null;
    
    // 重新渲染表格
    renderAuthTable();
    
    return true;
}

// 检查是否有未保存的更改
function hasUnsavedChanges() {
    return editingRowIndex !== null;
}

// 关闭抽屉前的确认
function closeDrawerWithConfirm() {
    if (hasUnsavedChanges()) {
        if (!confirmUnsavedChanges()) {
            return;
        }
    }
    
    // 关闭抽屉
    const otherAuthDrawer = document.getElementById('otherAuthDrawer');
    otherAuthDrawer.classList.remove('active');
    
    // 重置状态
    editingRowIndex = null;
    originalRowData = null;
    currentAuthData = [];
    currentResourceId = null;
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
    // 获取弹窗元素
    const inheritSettingsModal = document.getElementById('inheritSettingsModal');
    const closeInheritModal = document.getElementById('closeInheritModal');
    const cancelInheritBtn = document.getElementById('cancelInheritBtn');
    const saveInheritBtn = document.getElementById('saveInheritBtn');
    
    // 初始化多选下拉框
    initUserSelectDropdown();
    
    // 关闭弹窗的函数
    const closeInheritSettingsModal = function() {
        inheritSettingsModal.style.display = 'none';
        // 清理下拉框状态
        const dropdownList = document.getElementById('dropdownList');
        if (dropdownList) {
            dropdownList.classList.remove('active');
        }
        const selectInput = document.getElementById('selectInput');
        if (selectInput) {
            selectInput.classList.remove('active');
        }
    };
    
    // 移除之前的事件监听器
    const newCloseBtn = closeInheritModal.cloneNode(true);
    closeInheritModal.parentNode.replaceChild(newCloseBtn, closeInheritModal);
    
    const newCancelBtn = cancelInheritBtn.cloneNode(true);
    cancelInheritBtn.parentNode.replaceChild(newCancelBtn, cancelInheritBtn);
    
    const newSaveBtn = saveInheritBtn.cloneNode(true);
    saveInheritBtn.parentNode.replaceChild(newSaveBtn, saveInheritBtn);
    
    // 绑定关闭按钮事件
    newCloseBtn.addEventListener('click', closeInheritSettingsModal);
    newCancelBtn.addEventListener('click', closeInheritSettingsModal);
    
    // 保存设置
    newSaveBtn.addEventListener('click', function() {
        // 保存当前选择的用户
        console.log('已保存授权排除设置，排除用户数量：', inheritExceptionUsers.length);
        
        // 关闭弹窗
        closeInheritSettingsModal();
        
        // 更新资源表格
        renderResourceTable(resourceSearch.value, currentAppType);
        
        // 显示成功提示
        showToast('授权排除设置已更新', 'success');
    });
    
    // 显示弹窗
    inheritSettingsModal.style.display = 'flex';
}

// 初始化用户选择下拉框
function initUserSelectDropdown() {
    const selectInput = document.getElementById('selectInput');
    const dropdownList = document.getElementById('dropdownList');
    
    // 渲染用户选项
    function renderUserOptions(users = mockUsers) {
        const optionList = document.getElementById('optionList');
        optionList.innerHTML = '';
        
        // 添加用户选项
        users.forEach(user => {
            const option = document.createElement('div');
            option.className = 'dropdown-option';
            option.innerHTML = `
                <input type="checkbox" id="user_${user.id}" ${inheritExceptionUsers.includes(user.id) ? 'checked' : ''}>
                <label for="user_${user.id}">${user.name}</label>
            `;
            
            const checkbox = option.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    if (!inheritExceptionUsers.includes(user.id)) {
                        inheritExceptionUsers.push(user.id);
                    }
                } else {
                    const index = inheritExceptionUsers.indexOf(user.id);
                    if (index > -1) {
                        inheritExceptionUsers.splice(index, 1);
                    }
                }
                updateSelectedUsers();
            });
            
            optionList.appendChild(option);
        });
    }
    
    // 更新已选择用户显示
    function updateSelectedUsers() {
        const selectedUsersDisplay = document.getElementById('selectedUsersDisplay');
        selectedUsersDisplay.innerHTML = '';
        
        if (inheritExceptionUsers.length === 0) {
            // 显示占位符
            const placeholder = document.createElement('span');
            placeholder.className = 'placeholder';
            placeholder.textContent = '请选择要排除的用户';
            selectedUsersDisplay.appendChild(placeholder);
        } else {
            // 显示选中的用户标签
            inheritExceptionUsers.forEach(userId => {
                const user = mockUsers.find(u => u.id === userId);
                if (user) {
                    const userTag = document.createElement('span');
                    userTag.className = 'user-tag';
                    userTag.innerHTML = `
                        ${user.name}
                        <span class="remove-btn" data-user-id="${user.id}">×</span>
                    `;
                    
                    const removeBtn = userTag.querySelector('.remove-btn');
                    removeBtn.addEventListener('click', function(e) {
                        e.stopPropagation(); // 防止触发下拉框点击事件
                        const userIdToRemove = this.getAttribute('data-user-id');
                        const index = inheritExceptionUsers.indexOf(userIdToRemove);
                        if (index > -1) {
                            inheritExceptionUsers.splice(index, 1);
                        }
                        updateSelectedUsers();
                        renderUserOptions();
                    });
                    
                    selectedUsersDisplay.appendChild(userTag);
                }
            });
        }
    }
    
    // 点击输入框显示/隐藏下拉列表
    selectInput.addEventListener('click', function() {
        const isActive = dropdownList.classList.contains('active');
        if (isActive) {
            dropdownList.classList.remove('active');
            selectInput.classList.remove('active');
        } else {
            dropdownList.classList.add('active');
            selectInput.classList.add('active');
            renderUserOptions();
        }
    });
    
    // 点击其他地方关闭下拉列表
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.multi-select-dropdown')) {
            dropdownList.classList.remove('active');
            selectInput.classList.remove('active');
        }
    });
    
    // 初始化显示
    updateSelectedUsers();
}

// 编辑授权行功能
function editAuthRow(index) {
    console.log('编辑授权行:', index);
    
    // 使用当前的授权数据
    const currentAuth = currentAuthData[index];
    if (!currentAuth) {
        showToast('未找到授权数据', 'error');
        return;
    }
    
    // 创建编辑模态框
    const editModal = document.createElement('div');
    editModal.className = 'modal';
    editModal.id = 'editAuthModal';
    editModal.style.display = 'flex';
    
    editModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>编辑授权</h2>
                <button class="close-btn" onclick="closeEditAuthModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>应用名称：</label>
                    <span>${currentAuth.app || currentAuth.appName || '未知应用'}</span>
                </div>
                <div class="form-group">
                    <label>授权主体：</label>
                    <span>${currentAuth.subject || '未知主体'}</span>
                </div>
                <div class="form-group">
                    <label>授权有效期：</label>
                    <div class="radio-group">
                        <div class="radio-item">
                            <input type="radio" id="editPermanentRadio" name="editValidityType" value="permanent" ${(currentAuth.validity && currentAuth.validity.type === 'permanent') || currentAuth.type === 'permanent' ? 'checked' : ''}>
                            <label for="editPermanentRadio">永久有效</label>
                        </div>
                        <div class="radio-item">
                            <input type="radio" id="editTemporaryRadio" name="editValidityType" value="temporary" ${(currentAuth.validity && currentAuth.validity.type === 'temporary') || currentAuth.type === 'temporary' ? 'checked' : ''}>
                            <label for="editTemporaryRadio">设置有效期</label>
                        </div>
                    </div>
                </div>
                <div id="editDateRangeGroup" class="form-group" style="display: ${((currentAuth.validity && currentAuth.validity.type === 'temporary') || currentAuth.type === 'temporary') ? 'block' : 'none'}">
                    <label>有效期：</label>
                    <div class="date-range">
                        <input type="date" id="editStartDate" value="${(currentAuth.validity && currentAuth.validity.startDate) || currentAuth.startDate || ''}">
                        <span>至</span>
                        <input type="date" id="editEndDate" value="${(currentAuth.validity && currentAuth.validity.endDate) || currentAuth.endDate || ''}">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="closeEditAuthModal()">取消</button>
                <button class="primary-btn" onclick="saveEditAuth(${index})">保存</button>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(editModal);
    
    // 添加事件监听器
    const permanentRadio = document.getElementById('editPermanentRadio');
    const temporaryRadio = document.getElementById('editTemporaryRadio');
    const dateRangeGroup = document.getElementById('editDateRangeGroup');
    
    permanentRadio.addEventListener('change', function() {
        if (this.checked) {
            dateRangeGroup.style.display = 'none';
        }
    });
    
    temporaryRadio.addEventListener('change', function() {
        if (this.checked) {
            dateRangeGroup.style.display = 'block';
        }
    });
}

// 删除授权行功能
function removeAuthRow(index, authType, resourceId) {
    console.log('删除授权行:', index, '类型:', authType, '资源ID:', resourceId);
    
    // 显示确认对话框
    if (confirm('确定要取消这条授权关系吗？此操作不可撤销。')) {
        // 查找对应的资源数据
        const resourceIndex = resourcesData.findIndex(r => r.id == resourceId);
        if (resourceIndex !== -1) {
            const resource = resourcesData[resourceIndex];
            
            // 根据periodIndex删除对应的授权记录
            const authToDelete = currentAuthData[index];
            const periodIndex = authToDelete.periodIndex;
            
            if (resource.validity.periods && periodIndex >= 0 && periodIndex < resource.validity.periods.length) {
                // 删除指定索引的时间段
                resource.validity.periods.splice(periodIndex, 1);
                
                // 删除操作后，剩余授权的isDirect属性应该保持不变
                // 授权类型是固定属性，不应该因为删除操作而改变
                if (authType === 'direct') {
                    // 删除直接授权后，剩余的间接授权保持其原有的isDirect=false属性
                    // 不需要修改任何剩余授权的isDirect属性
                } else {
                    // 删除间接授权后，剩余的授权（无论是直接还是间接）都保持其原有的isDirect属性
                    // 不需要修改任何剩余授权的isDirect属性
                }
                
                // 如果删除后没有时间段了，设置为未授权
                if (resource.validity.periods.length === 0) {
                    resource.validity = {
                        type: 'unauthorized'
                    };
                    resource.icon = '未';
                    resource.iconColor = 'gray';
                } else if (resource.validity.periods.length === 1) {
                    // 如果只剩一个时间段，转换为单个授权
                    const remainingPeriod = resource.validity.periods[0];
                    if (remainingPeriod.type === 'permanent') {
                        resource.validity = {
                            type: 'permanent',
                            startDate: null,
                            endDate: null
                        };
                    } else {
                        resource.validity = {
                            type: 'temporary',
                            startDate: remainingPeriod.startDate,
                            endDate: remainingPeriod.endDate
                        };
                    }
                }
            } else {
                // 对于单个授权，设置为未授权状态
                resource.validity = {
                    type: 'unauthorized'
                };
                resource.icon = '未';
                resource.iconColor = 'gray';
            }
            
            console.log('删除授权行:', index, '更新后的资源数据:', resource);
            showToast('已取消授权', 'success');
            
            // 重新渲染主表格以反映变化
            renderResourceTable(document.getElementById('resourceSearch').value, currentAppType);
            
            // 重新加载抽屉内容以反映删除后的变化
            viewOtherAuth(resourceId);
        }
    } else {
        // 用户选择取消，不执行任何操作
        console.log('用户取消了删除操作');
    }
}

// 关闭编辑授权模态框
function closeEditAuthModal() {
    const editModal = document.getElementById('editAuthModal');
    if (editModal) {
        editModal.remove();
    }
}

// 保存编辑的授权
function saveEditAuth(index) {
    const validityType = document.querySelector('input[name="editValidityType"]:checked').value;
    const startDate = document.getElementById('editStartDate').value;
    const endDate = document.getElementById('editEndDate').value;
    
    // 验证临时授权的日期
    if (validityType === 'temporary') {
        if (!startDate || !endDate) {
            showToast('请选择有效期开始和结束日期', 'error');
            return;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            showToast('开始日期必须早于结束日期', 'error');
            return;
        }
    }
    
    // 更新currentAuthData中的数据
    if (currentAuthData[index]) {
        currentAuthData[index].validityType = validityType;
        currentAuthData[index].startDate = validityType === 'permanent' ? null : startDate;
        currentAuthData[index].endDate = validityType === 'permanent' ? null : endDate;
        currentAuthData[index].validity = validityType === 'permanent' ? '永久授权' : `${startDate} 至 ${endDate}`;
    }
    
    // 同步更新resourcesData中的原始数据
    const resourceIndex = resourcesData.findIndex(r => r.id == currentResourceId);
    if (resourceIndex !== -1) {
        const resource = resourcesData[resourceIndex];
        const authData = currentAuthData[index];
        
        // 如果是直接授权
        if (authData.type === 'direct') {
            if (resource.validity.periods) {
                // 组合授权：更新第一个时间段
                if (validityType === 'permanent') {
                    resource.validity.periods[0] = { type: 'permanent' };
                } else {
                    resource.validity.periods[0] = { startDate: startDate, endDate: endDate };
                }
            } else {
                // 单个授权：直接更新validity
                if (validityType === 'permanent') {
                    resource.validity = {
                        type: 'permanent',
                        startDate: null,
                        endDate: null
                    };
                } else {
                    resource.validity = {
                        type: 'temporary',
                        startDate: startDate,
                        endDate: endDate
                    };
                }
            }
        } else if (authData.type === 'indirect' && resource.validity.periods) {
            // 间接授权：找到对应的时间段进行更新
            // 间接授权在currentAuthData中的索引需要减去直接授权的数量
            const directAuthCount = currentAuthData.filter(auth => auth.type === 'direct').length;
            const indirectIndex = index - directAuthCount;
            
            if (resource.validity.periods[indirectIndex]) {
                if (validityType === 'permanent') {
                    resource.validity.periods[indirectIndex] = { type: 'permanent' };
                } else {
                    resource.validity.periods[indirectIndex] = { startDate: startDate, endDate: endDate };
                }
            }
        }
        
        // 重新渲染主表格以反映变化
        renderResourceTable(document.getElementById('resourceSearch').value, currentAppType);
    }
    
    showToast('应用授权已更新', 'success');
    closeEditAuthModal();
    
    // 重新加载抽屉内容以显示更新后的数据
    viewOtherAuth(currentResourceId);
}

 // 关闭查看其他授权抽屉式弹窗
function closeOtherAuthDrawer() {
    closeDrawerWithConfirm();
}

// 打开新增授权时间选择弹窗
function openAddAuthModal(resourceId) {
    // 调用授权设置弹窗，模式为新增
    openAuthSettingsModal(resourceId, 'add');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化DOM元素引用
    initDOMReferences();
    
    // 初始化页面
    initPage();
    
    // 添加关闭查看其他授权抽屉式弹窗的事件监听器
    const closeOtherAuthDrawerBtn = document.getElementById('closeOtherAuthDrawer');
    if (closeOtherAuthDrawerBtn) {
        closeOtherAuthDrawerBtn.addEventListener('click', closeDrawerWithConfirm);
    }
    
    // 绑定取消授权弹窗的事件
    const closeRemoveAuthModalBtn = document.getElementById('closeRemoveAuthModal');
    const cancelRemoveAuthBtn = document.getElementById('cancelRemoveAuthBtn');
    const confirmRemoveAuthBtn = document.getElementById('confirmRemoveAuthBtn');
    
    if (closeRemoveAuthModalBtn) {
        closeRemoveAuthModalBtn.addEventListener('click', closeRemoveAuthModal);
    }
    
    if (cancelRemoveAuthBtn) {
        cancelRemoveAuthBtn.addEventListener('click', closeRemoveAuthModal);
    }
    
    if (confirmRemoveAuthBtn) {
        confirmRemoveAuthBtn.addEventListener('click', removeAuth);
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
        // 确保按钮样式正确
        saveAuthBtn.style.display = 'inline-block';
        saveAuthBtn.style.visibility = 'visible';
        saveAuthBtn.style.opacity = '1';
        console.log('初始化确定按钮样式:', saveAuthBtn.style.display, saveAuthBtn.style.visibility, saveAuthBtn.style.opacity);
    }
    
    // 确保取消授权按钮绑定了正确的事件处理程序
    const removeAuthBtn = document.getElementById('removeAuthBtn');
    if (removeAuthBtn) {
        removeAuthBtn.addEventListener('click', removeAuth);
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
