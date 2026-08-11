// 业务模块通用 CRUD 页面配置
// key = 前端完整路由路径（与后端菜单 path 对应），value 含 moduleKey（后端 @BizModule 的 value）
// column.type=tag 时按 dict 映射标签与 tagType；form.type 控制表单控件

const S = (obj) => obj // 别名，便于阅读

export const bizConfig = {
  // ---------------- 来访管理 ----------------
  '/visit/appointment': {
    moduleKey: 'visitAppointment',
    columns: [
      { prop: 'visitorName', label: '访客姓名', minWidth: 110 },
      { prop: 'phone', label: '手机号', minWidth: 130 },
      { prop: 'elderName', label: '探访老人', minWidth: 110 },
      { prop: 'visitTime', label: '预约时间', minWidth: 160 },
      { prop: 'purpose', label: '来访事由' },
      { prop: 'status', label: '状态', width: 100, type: 'tag', dict: { 0: '待接待', 1: '已接待', 2: '已取消' }, tagType: { 0: 'info', 1: 'success', 2: 'danger' } }
    ],
    search: ['visitorName', 'elderName', 'status'],
    form: [
      { prop: 'visitorName', label: '访客姓名', required: true },
      { prop: 'phone', label: '手机号' },
      { prop: 'elderName', label: '探访老人' },
      { prop: 'visitTime', label: '预约时间', type: 'datetime' },
      { prop: 'purpose', label: '来访事由', type: 'textarea' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '待接待', 1: '已接待', 2: '已取消' }, default: 0 }
    ]
  },
  '/visit/registration': {
    moduleKey: 'visitRegistration',
    columns: [
      { prop: 'visitorName', label: '访客姓名', minWidth: 110 },
      { prop: 'phone', label: '手机号', minWidth: 130 },
      { prop: 'idCard', label: '证件号码', minWidth: 150 },
      { prop: 'elderName', label: '被探访老人', minWidth: 110 },
      { prop: 'relation', label: '与老人关系', minWidth: 100 },
      { prop: 'arriveTime', label: '到达时间', minWidth: 160 },
      { prop: 'leaveTime', label: '离开时间', minWidth: 160 }
    ],
    search: ['visitorName', 'elderName'],
    form: [
      { prop: 'visitorName', label: '访客姓名', required: true },
      { prop: 'phone', label: '手机号' },
      { prop: 'idCard', label: '证件号码' },
      { prop: 'elderName', label: '被探访老人' },
      { prop: 'relation', label: '与老人关系' },
      { prop: 'arriveTime', label: '到达时间', type: 'datetime' },
      { prop: 'leaveTime', label: '离开时间', type: 'datetime' }
    ]
  },

  // ---------------- 入退管理 ----------------
  '/checkin/manage': {
    moduleKey: 'checkinAdmission',
    columns: [
      { prop: 'elderName', label: '老人姓名', minWidth: 110 },
      { prop: 'idCard', label: '身份证号', minWidth: 160 },
      { prop: 'sex', label: '性别', width: 70, type: 'tag', dict: { 0: '男', 1: '女' }, tagType: { 0: '', 1: 'warning' } },
      { prop: 'age', label: '年龄', width: 80 },
      { prop: 'contractNo', label: '合同编号', minWidth: 130 },
      { prop: 'familyName', label: '家属姓名', minWidth: 100 },
      { prop: 'familyPhone', label: '家属电话', minWidth: 130 },
      { prop: 'checkInTime', label: '入住时间', minWidth: 160 },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '在住', 1: '已退住' }, tagType: { 0: 'success', 1: 'info' } }
    ],
    search: ['elderName', 'idCard', 'status'],
    form: [
      { prop: 'elderName', label: '老人姓名', required: true },
      { prop: 'idCard', label: '身份证号' },
      { prop: 'sex', label: '性别', type: 'select', dict: { 0: '男', 1: '女' }, default: 0 },
      { prop: 'age', label: '年龄', type: 'number' },
      { prop: 'contractNo', label: '合同编号' },
      { prop: 'familyName', label: '家属姓名' },
      { prop: 'familyPhone', label: '家属电话' },
      { prop: 'checkInTime', label: '入住时间', type: 'datetime' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '在住', 1: '已退住' }, default: 0 }
    ]
  },
  '/checkin/checkout': {
    moduleKey: 'checkinCheckout',
    columns: [
      { prop: 'elderName', label: '老人姓名', minWidth: 110 },
      { prop: 'bedId', label: '床位ID', width: 90 },
      { prop: 'checkOutTime', label: '退住时间', minWidth: 160 },
      { prop: 'reason', label: '退住原因' },
      { prop: 'refundAmount', label: '退款金额', width: 110 },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '待审批', 1: '已退住' }, tagType: { 0: 'warning', 1: 'success' } }
    ],
    search: ['elderName', 'status'],
    form: [
      { prop: 'elderName', label: '老人姓名', required: true },
      { prop: 'bedId', label: '床位ID', type: 'number' },
      { prop: 'checkOutTime', label: '退住时间', type: 'datetime' },
      { prop: 'reason', label: '退住原因', type: 'textarea' },
      { prop: 'refundAmount', label: '退款金额', type: 'number' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '待审批', 1: '已退住' }, default: 0 }
    ]
  },

  // ---------------- 在住管理 ----------------
  '/resident/room': {
    moduleKey: 'residentRoom',
    columns: [
      { prop: 'roomNo', label: '房号', width: 100 },
      { prop: 'typeName', label: '房型名称', minWidth: 120 },
      { prop: 'floor', label: '楼层', width: 90 },
      { prop: 'bedCount', label: '床位数量', width: 100 },
      { prop: 'area', label: '面积(㎡)', width: 100 },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '启用', 1: '停用' }, tagType: { 0: 'success', 1: 'danger' } }
    ],
    search: ['roomNo', 'typeName', 'status'],
    form: [
      { prop: 'roomNo', label: '房号', required: true },
      { prop: 'typeName', label: '房型名称' },
      { prop: 'floor', label: '楼层' },
      { prop: 'bedCount', label: '床位数量', type: 'number' },
      { prop: 'area', label: '面积(㎡)', type: 'number' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '启用', 1: '停用' }, default: 0 }
    ]
  },
  '/resident/bed': {
    moduleKey: 'residentBed',
    columns: [
      { prop: 'bedNo', label: '床位号', width: 110 },
      { prop: 'roomId', label: '房型ID', width: 100 },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '空闲', 1: '占用', 2: '维修' }, tagType: { 0: 'success', 1: 'warning', 2: 'danger' } }
    ],
    search: ['bedNo', 'status'],
    form: [
      { prop: 'bedNo', label: '床位号', required: true },
      { prop: 'roomId', label: '房型ID', type: 'number' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '空闲', 1: '占用', 2: '维修' }, default: 0 }
    ]
  },
  '/resident/contract': {
    moduleKey: 'residentContract',
    columns: [
      { prop: 'contractNo', label: '合同编号', minWidth: 130 },
      { prop: 'elderName', label: '老人姓名', minWidth: 110 },
      { prop: 'bedId', label: '床位ID', width: 90 },
      { prop: 'startDate', label: '开始日期', minWidth: 160 },
      { prop: 'endDate', label: '结束日期', minWidth: 160 },
      { prop: 'monthlyFee', label: '月费', width: 100 },
      { prop: 'deposit', label: '押金', width: 100 },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '生效', 1: '到期', 2: '作废' }, tagType: { 0: 'success', 1: 'warning', 2: 'danger' } }
    ],
    search: ['contractNo', 'elderName', 'status'],
    form: [
      { prop: 'contractNo', label: '合同编号', required: true },
      { prop: 'elderName', label: '老人姓名' },
      { prop: 'bedId', label: '床位ID', type: 'number' },
      { prop: 'startDate', label: '开始日期', type: 'datetime' },
      { prop: 'endDate', label: '结束日期', type: 'datetime' },
      { prop: 'monthlyFee', label: '月费', type: 'number' },
      { prop: 'deposit', label: '押金', type: 'number' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '生效', 1: '到期', 2: '作废' }, default: 0 }
    ]
  },
  '/resident/leave': {
    moduleKey: 'residentLeave',
    columns: [
      { prop: 'elderName', label: '老人姓名', minWidth: 110 },
      { prop: 'bedId', label: '床位ID', width: 90 },
      { prop: 'startTime', label: '请假开始', minWidth: 160 },
      { prop: 'endTime', label: '请假结束', minWidth: 160 },
      { prop: 'reason', label: '请假事由' },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '待审批', 1: '批准', 2: '驳回' }, tagType: { 0: 'warning', 1: 'success', 2: 'danger' } }
    ],
    search: ['elderName', 'status'],
    form: [
      { prop: 'elderName', label: '老人姓名', required: true },
      { prop: 'bedId', label: '床位ID', type: 'number' },
      { prop: 'startTime', label: '请假开始', type: 'datetime' },
      { prop: 'endTime', label: '请假结束', type: 'datetime' },
      { prop: 'reason', label: '请假事由', type: 'textarea' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '待审批', 1: '批准', 2: '驳回' }, default: 0 }
    ]
  },

  // ---------------- 服务管理 ----------------
  '/service/task': {
    moduleKey: 'serviceTask',
    columns: [
      { prop: 'taskName', label: '任务名称', minWidth: 120 },
      { prop: 'elderName', label: '老人姓名', minWidth: 110 },
      { prop: 'executor', label: '执行人', minWidth: 100 },
      { prop: 'planTime', label: '计划时间', minWidth: 160 },
      { prop: 'status', label: '状态', width: 100, type: 'tag', dict: { 0: '待执行', 1: '执行中', 2: '已完成' }, tagType: { 0: 'info', 1: 'warning', 2: 'success' } }
    ],
    search: ['taskName', 'elderName', 'status'],
    form: [
      { prop: 'taskName', label: '任务名称', required: true },
      { prop: 'elderName', label: '老人姓名' },
      { prop: 'executor', label: '执行人' },
      { prop: 'planTime', label: '计划时间', type: 'datetime' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '待执行', 1: '执行中', 2: '已完成' }, default: 0 }
    ]
  },
  '/service/plan': {
    moduleKey: 'servicePlan',
    columns: [
      { prop: 'planName', label: '计划名称', minWidth: 120 },
      { prop: 'elderName', label: '老人姓名', minWidth: 110 },
      { prop: 'startDate', label: '开始日期', minWidth: 160 },
      { prop: 'endDate', label: '结束日期', minWidth: 160 },
      { prop: 'content', label: '计划内容' },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '启用', 1: '停用' }, tagType: { 0: 'success', 1: 'danger' } }
    ],
    search: ['planName', 'elderName', 'status'],
    form: [
      { prop: 'planName', label: '计划名称', required: true },
      { prop: 'elderName', label: '老人姓名' },
      { prop: 'startDate', label: '开始日期', type: 'datetime' },
      { prop: 'endDate', label: '结束日期', type: 'datetime' },
      { prop: 'content', label: '计划内容', type: 'textarea' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '启用', 1: '停用' }, default: 0 }
    ]
  },

  // ---------------- 财务管理 ----------------
  '/finance/bill': {
    moduleKey: 'financeBill',
    columns: [
      { prop: 'billNo', label: '账单编号', minWidth: 130 },
      { prop: 'elderName', label: '老人姓名', minWidth: 110 },
      { prop: 'billMonth', label: '账期', width: 100 },
      { prop: 'billType', label: '账单类型', minWidth: 100 },
      { prop: 'amount', label: '金额', width: 100 },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '未缴', 1: '已缴', 2: '已退费' }, tagType: { 0: 'warning', 1: 'success', 2: 'danger' } }
    ],
    search: ['billNo', 'elderName', 'status'],
    form: [
      { prop: 'billNo', label: '账单编号', required: true },
      { prop: 'elderName', label: '老人姓名' },
      { prop: 'billMonth', label: '账期(YYYY-MM)' },
      { prop: 'billType', label: '账单类型' },
      { prop: 'amount', label: '金额', type: 'number' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '未缴', 1: '已缴', 2: '已退费' }, default: 0 }
    ]
  },
  '/finance/prestored': {
    moduleKey: 'financePrestore',
    columns: [
      { prop: 'elderName', label: '老人姓名', minWidth: 110 },
      { prop: 'amount', label: '金额', width: 100 },
      { prop: 'balance', label: '余额', width: 100 },
      { prop: 'transType', label: '类型', width: 90, type: 'tag', dict: { 0: '充值', 1: '消费' }, tagType: { 0: 'success', 1: 'warning' } }
    ],
    search: ['elderName', 'transType'],
    form: [
      { prop: 'elderName', label: '老人姓名', required: true },
      { prop: 'amount', label: '金额', type: 'number' },
      { prop: 'balance', label: '余额', type: 'number' },
      { prop: 'transType', label: '类型', type: 'select', dict: { 0: '充值', 1: '消费' }, default: 0 }
    ]
  },

  // ---------------- 订单管理 ----------------
  '/order/list': {
    moduleKey: 'orderInfo',
    columns: [
      { prop: 'orderNo', label: '订单编号', minWidth: 130 },
      { prop: 'customerName', label: '客户姓名', minWidth: 110 },
      { prop: 'productName', label: '商品/服务', minWidth: 120 },
      { prop: 'amount', label: '金额', width: 100 },
      { prop: 'status', label: '状态', width: 100, type: 'tag', dict: { 0: '待支付', 1: '已支付', 2: '已取消', 3: '已完成' }, tagType: { 0: 'warning', 1: 'success', 2: 'info', 3: 'primary' } }
    ],
    search: ['orderNo', 'customerName', 'status'],
    form: [
      { prop: 'orderNo', label: '订单编号', required: true },
      { prop: 'customerName', label: '客户姓名' },
      { prop: 'productName', label: '商品/服务' },
      { prop: 'amount', label: '金额', type: 'number' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '待支付', 1: '已支付', 2: '已取消', 3: '已完成' }, default: 0 }
    ]
  },
  '/order/refund': {
    moduleKey: 'orderRefund',
    columns: [
      { prop: 'orderNo', label: '原订单号', minWidth: 130 },
      { prop: 'refundNo', label: '退款单号', minWidth: 130 },
      { prop: 'amount', label: '退款金额', width: 110 },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '待退款', 1: '已退款', 2: '已拒绝' }, tagType: { 0: 'warning', 1: 'success', 2: 'danger' } }
    ],
    search: ['orderNo', 'status'],
    form: [
      { prop: 'orderNo', label: '原订单号', required: true },
      { prop: 'refundNo', label: '退款单号' },
      { prop: 'amount', label: '退款金额', type: 'number' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '待退款', 1: '已退款', 2: '已拒绝' }, default: 0 }
    ]
  },

  // ---------------- 客户管理 ----------------
  '/customer/list': {
    moduleKey: 'customerInfo',
    columns: [
      { prop: 'name', label: '客户姓名', minWidth: 110 },
      { prop: 'phone', label: '手机号', minWidth: 130 },
      { prop: 'idCard', label: '证件号', minWidth: 150 },
      { prop: 'cusType', label: '客户类型', minWidth: 100 },
      { prop: 'source', label: '客户来源', minWidth: 100 }
    ],
    search: ['name', 'phone', 'cusType'],
    form: [
      { prop: 'name', label: '客户姓名', required: true },
      { prop: 'phone', label: '手机号' },
      { prop: 'idCard', label: '证件号' },
      { prop: 'cusType', label: '客户类型' },
      { prop: 'source', label: '客户来源' }
    ]
  },

  // ---------------- 消息中心 ----------------
  '/message/push': {
    moduleKey: 'messagePush',
    columns: [
      { prop: 'title', label: '消息标题', minWidth: 130 },
      { prop: 'receiver', label: '接收人', minWidth: 110 },
      { prop: 'msgType', label: '消息类型', minWidth: 100 },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '待发送', 1: '已发送', 2: '已读' }, tagType: { 0: 'warning', 1: 'success', 2: 'info' } }
    ],
    search: ['title', 'status'],
    form: [
      { prop: 'title', label: '消息标题', required: true },
      { prop: 'content', label: '消息内容', type: 'textarea' },
      { prop: 'receiver', label: '接收人' },
      { prop: 'msgType', label: '消息类型' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '待发送', 1: '已发送', 2: '已读' }, default: 0 }
    ]
  },

  // ---------------- 智能监测 ----------------
  '/iot/device': {
    moduleKey: 'iotDevice',
    columns: [
      { prop: 'deviceName', label: '设备名称', minWidth: 120 },
      { prop: 'deviceNo', label: '设备编号', minWidth: 130 },
      { prop: 'deviceType', label: '设备类型', minWidth: 100 },
      { prop: 'location', label: '安装位置', minWidth: 120 },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '离线', 1: '在线', 2: '故障' }, tagType: { 0: 'info', 1: 'success', 2: 'danger' } }
    ],
    search: ['deviceName', 'deviceType', 'status'],
    form: [
      { prop: 'deviceName', label: '设备名称', required: true },
      { prop: 'deviceNo', label: '设备编号' },
      { prop: 'deviceType', label: '设备类型' },
      { prop: 'location', label: '安装位置' },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '离线', 1: '在线', 2: '故障' }, default: 1 }
    ]
  },
  '/iot/alarm': {
    moduleKey: 'iotAlarmRule',
    columns: [
      { prop: 'ruleName', label: '规则名称', minWidth: 120 },
      { prop: 'deviceType', label: '设备类型', minWidth: 100 },
      { prop: 'alarmCondition', label: '触发条件', minWidth: 130 },
      { prop: 'threshold', label: '阈值', width: 100 },
      { prop: 'alarmLevel', label: '级别', width: 90, type: 'tag', dict: { 0: '提示', 1: '警告', 2: '严重' }, tagType: { 0: 'info', 1: 'warning', 2: 'danger' } },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '启用', 1: '停用' }, tagType: { 0: 'success', 1: 'danger' } }
    ],
    search: ['ruleName', 'deviceType', 'status'],
    form: [
      { prop: 'ruleName', label: '规则名称', required: true },
      { prop: 'deviceType', label: '设备类型' },
      { prop: 'alarmCondition', label: '触发条件' },
      { prop: 'threshold', label: '阈值' },
      { prop: 'alarmLevel', label: '报警级别', type: 'select', dict: { 0: '提示', 1: '警告', 2: '严重' }, default: 0 },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '启用', 1: '停用' }, default: 0 }
    ]
  },

  // ---------------- 权限管理 ----------------
  '/system/post': {
    moduleKey: 'post',
    columns: [
      { prop: 'postCode', label: '岗位编码', width: 130 },
      { prop: 'postName', label: '岗位名称', width: 140 },
      { prop: 'postSort', label: '显示顺序', width: 100 },
      { prop: 'status', label: '状态', width: 90, type: 'tag', dict: { 0: '正常', 1: '停用' }, tagType: { 0: 'success', 1: 'danger' } },
      { prop: 'remark', label: '备注', minWidth: 180 },
      { prop: 'createTime', label: '创建时间', width: 180 }
    ],
    search: ['postCode', 'postName', 'status'],
    form: [
      { prop: 'postCode', label: '岗位编码', required: true },
      { prop: 'postName', label: '岗位名称', required: true },
      { prop: 'postSort', label: '显示顺序', type: 'number', required: true },
      { prop: 'status', label: '状态', type: 'select', dict: { 0: '正常', 1: '停用' }, default: 0 },
      { prop: 'remark', label: '备注', type: 'textarea' }
    ]
  }
}

export default bizConfig
