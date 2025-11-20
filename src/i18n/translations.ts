export type Language = 'en' | 'zh';

export interface Translations {
  // Login
  loginTitle: string;
  loginSubtitle: string;
  username: string;
  password: string;
  signIn: string;
  enterUsername: string;
  enterPassword: string;
  enterBothCredentials: string;
  invalidCredentials: string;
  loggingIn: string;

  // Dashboard Header
  dashboardTitle: string;
  welcome: string;
  logout: string;
  changePassword: string;
  stats: string;

  // Code List
  activationCodes: string;
  createCodes: string;
  deleteSelected: string;
  deleteExpired: string;
  searchPlaceholder: string;
  code: string;
  status: string;
  createdAt: string;
  activatedAt: string;
  expiresAt: string;
  actions: string;
  delete: string;
  noCodesMatch: string;
  noCodesYet: string;
  previous: string;
  next: string;
  pageOf: string;
  loadMore: string;
  loading: string;
  refresh: string;

  // Code Editor
  createTitle: string;
  numberOfCodes: string;
  enterCount: string;
  codePrefix: string;
  enterPrefix: string;
  prefixOptional: string;
  cancel: string;
  create: string;
  generating: string;

  // Status
  used: string;
  unused: string;
  active: string;
  expired: string;

  // Stats
  totalCodes: string;
  unusedCodes: string;
  usedCodes: string;
  activeCodes: string;

  // Change Password
  changePasswordTitle: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  enterOldPassword: string;
  enterNewPassword: string;
  enterConfirmPassword: string;
  enterAllFields: string;
  passwordMinLength: string;
  passwordsNotMatch: string;
  passwordsMatch: string;
  passwordsSame: string;
  passwordChanged: string;
  changePasswordButton: string;

  // Validation
  countRange: string;

  // Confirmations
  deleteConfirm: string;
  deleteExpiredConfirm: string;
  batchDeleteConfirm: string;

  // Batch Delete
  batchDeleteTitle: string;
  batchDelete: string;
  deletePattern: string;
  deletePatternPlaceholder: string;
  useRegex: string;
  substringHint: string;
  regexHint: string;
  regexExamples: string;
  regexExample1: string;
  regexExample2: string;
  regexExample3: string;
  patternRequired: string;
  preview: string;
  previewResult: string;
  foundMatches: string;
  matchedCodes: string;
  andMore: string;
  deleteWarning: string;
  back: string;
  confirmDelete: string;
  deleting: string;

  // Messages
  error: string;
  success: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Login
    loginTitle: 'Admin Dashboard',
    loginSubtitle: 'Sign in to manage activation codes',
    username: 'Username',
    password: 'Password',
    signIn: 'Sign In',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    enterBothCredentials: 'Please enter both username and password',
    invalidCredentials: 'Invalid username or password',
    loggingIn: 'Logging in...',

    // Dashboard Header
    dashboardTitle: 'Activation Code Manager',
    welcome: 'Welcome',
    logout: 'Logout',
    changePassword: 'Change Password',
    stats: 'Statistics',

    // Code List
    activationCodes: 'Activation Codes',
    createCodes: '+ Create Codes',
    deleteSelected: 'Delete Selected',
    deleteExpired: 'Delete Expired',
    searchPlaceholder: 'Search by code...',
    code: 'Code',
    status: 'Status',
    createdAt: 'Created At',
    activatedAt: 'Activated At',
    expiresAt: 'Expires At',
    actions: 'Actions',
    delete: 'Delete',
    noCodesMatch: 'No codes match your search',
    noCodesYet: 'No activation codes yet. Create your first one!',
    previous: 'Previous',
    next: 'Next',
    pageOf: 'Page',
    loadMore: 'Load More',
    loading: 'Loading...',
    refresh: 'Refresh',

    // Code Editor
    createTitle: 'Create Activation Codes',
    numberOfCodes: 'Number of Codes',
    enterCount: 'Enter count (1-20,000)',
    codePrefix: 'Code Prefix',
    enterPrefix: 'Enter prefix (optional)',
    prefixOptional: 'Default: CODE',
    cancel: 'Cancel',
    create: 'Generate Codes',
    generating: 'Generating...',

    // Status
    used: 'Used',
    unused: 'Unused',
    active: 'Active',
    expired: 'Expired',

    // Stats
    totalCodes: 'Total Codes',
    unusedCodes: 'Unused Codes',
    usedCodes: 'Used Codes',
    activeCodes: 'Active Codes',

    // Change Password
    changePasswordTitle: 'Change Password',
    oldPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    enterOldPassword: 'Enter current password',
    enterNewPassword: 'Enter new password',
    enterConfirmPassword: 'Confirm new password',
    enterAllFields: 'Please fill in all fields',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordsNotMatch: 'Passwords do not match',
    passwordsMatch: 'Passwords match',
    passwordsSame: 'New password must be different from current password',
    passwordChanged: 'Password changed successfully',
    changePasswordButton: 'Change Password',

    // Validation
    countRange: 'Count must be between 1 and 20,000',

    // Confirmations
    deleteConfirm: 'Are you sure you want to delete this activation code?',
    deleteExpiredConfirm: 'Delete all expired activation codes?',
    batchDeleteConfirm: 'Are you sure you want to delete {count} activation codes? This action cannot be undone.',

    // Batch Delete
    batchDeleteTitle: 'Batch Delete Activation Codes',
    batchDelete: 'Batch Delete',
    deletePattern: 'Pattern',
    deletePatternPlaceholder: 'Enter pattern (e.g., TEST or TEST-.*)',
    useRegex: 'Use Regular Expression',
    substringHint: 'Will match codes containing this text',
    regexHint: 'Use regex pattern for advanced matching',
    regexExamples: 'Examples',
    regexExample1: 'Starts with TEST-',
    regexExample2: 'Ends with -2024',
    regexExample3: 'DEMO- followed by numbers',
    patternRequired: 'Please enter a pattern',
    preview: 'Preview Matches',
    previewResult: 'Preview Result',
    foundMatches: 'Found {count} matching codes',
    matchedCodes: 'Matched Codes',
    andMore: '...and {count} more',
    deleteWarning: 'This action will permanently delete these codes and cannot be undone!',
    back: 'Back',
    confirmDelete: 'Confirm Delete',
    deleting: 'Deleting...',

    // Messages
    error: 'Error',
    success: 'Success',
  },

  zh: {
    // Login
    loginTitle: '管理员控制台',
    loginSubtitle: '登录以管理激活码',
    username: '用户名',
    password: '密码',
    signIn: '登录',
    enterUsername: '请输入用户名',
    enterPassword: '请输入密码',
    enterBothCredentials: '请输入用户名和密码',
    invalidCredentials: '用户名或密码无效',
    loggingIn: '登录中...',

    // Dashboard Header
    dashboardTitle: '激活码管理系统',
    welcome: '欢迎',
    logout: '退出登录',
    changePassword: '修改密码',
    stats: '统计信息',

    // Code List
    activationCodes: '激活码',
    createCodes: '+ 创建激活码',
    deleteSelected: '删除选中项',
    deleteExpired: '删除过期',
    searchPlaceholder: '按激活码搜索...',
    code: '激活码',
    status: '状态',
    createdAt: '创建时间',
    activatedAt: '激活时间',
    expiresAt: '过期时间',
    actions: '操作',
    delete: '删除',
    noCodesMatch: '没有匹配的激活码',
    noCodesYet: '还没有激活码，创建第一个吧！',
    previous: '上一页',
    next: '下一页',
    pageOf: '第',
    loadMore: '加载更多',
    loading: '加载中...',
    refresh: '刷新',

    // Code Editor
    createTitle: '创建激活码',
    numberOfCodes: '创建数量',
    enterCount: '输入数量（1-20,000）',
    codePrefix: '激活码前缀',
    enterPrefix: '输入前缀（可选）',
    prefixOptional: '默认：CODE',
    cancel: '取消',
    create: '生成激活码',
    generating: '生成中...',

    // Status
    used: '已使用',
    unused: '未使用',
    active: '有效',
    expired: '已过期',

    // Stats
    totalCodes: '总激活码数',
    unusedCodes: '未使用',
    usedCodes: '已使用',
    activeCodes: '有效激活码',

    // Change Password
    changePasswordTitle: '修改密码',
    oldPassword: '当前密码',
    newPassword: '新密码',
    confirmPassword: '确认新密码',
    enterOldPassword: '输入当前密码',
    enterNewPassword: '输入新密码',
    enterConfirmPassword: '再次输入新密码',
    enterAllFields: '请填写所有字段',
    passwordMinLength: '密码至少需要6个字符',
    passwordsNotMatch: '两次输入的密码不一致',
    passwordsMatch: '密码匹配',
    passwordsSame: '新密码不能与当前密码相同',
    passwordChanged: '密码修改成功',
    changePasswordButton: '修改密码',

    // Validation
    countRange: '数量必须在 1 到 20,000 之间',

    // Confirmations
    deleteConfirm: '确定要删除此激活码吗？',
    deleteExpiredConfirm: '删除所有过期的激活码？',
    batchDeleteConfirm: '确定要删除 {count} 个激活码吗？此操作无法撤销。',

    // Batch Delete
    batchDeleteTitle: '批量删除激活码',
    batchDelete: '批量删除',
    deletePattern: '匹配模式',
    deletePatternPlaceholder: '输入模式（例如：TEST 或 TEST-.*）',
    useRegex: '使用正则表达式',
    substringHint: '将匹配包含此文本的激活码',
    regexHint: '使用正则表达式进行高级匹配',
    regexExamples: '示例',
    regexExample1: '以 TEST- 开头',
    regexExample2: '以 -2024 结尾',
    regexExample3: 'DEMO- 后跟数字',
    patternRequired: '请输入匹配模式',
    preview: '预览匹配结果',
    previewResult: '预览结果',
    foundMatches: '找到 {count} 个匹配的激活码',
    matchedCodes: '匹配的激活码',
    andMore: '...还有 {count} 个',
    deleteWarning: '此操作将永久删除这些激活码，无法撤销！',
    back: '返回',
    confirmDelete: '确认删除',
    deleting: '删除中...',

    // Messages
    error: '错误',
    success: '成功',
  },
};
