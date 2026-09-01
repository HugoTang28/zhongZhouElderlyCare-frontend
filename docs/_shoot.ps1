$ErrorActionPreference = 'Continue'
$ws = "C:\Users\txj\.codebuddy\plugins\marketplaces\codebuddy-plugins-official\external_plugins\superpowers-chrome\skills\browsing\chrome-ws"
$out = "d:/Github-project/zhongZhouElderlyCare/zzyl-frontend-b/docs/screenshots"

# 顺序：编号, 文件基名, 路由路径
$pages = @(
    @("00","login",               "/login"),
    @("01","workbench-dashboard", "/workbench/dashboard"),
    @("02","visit-appointment",   "/visit/appointment"),
    @("03","visit-registration",  "/visit/registration"),
    @("04","checkin-manage",      "/checkin/manage"),
    @("05","checkin-checkout",    "/checkin/checkout"),
    @("06","resident-room",       "/resident/room"),
    @("07","resident-bed",        "/resident/bed"),
    @("08","resident-contract",   "/resident/contract"),
    @("09","resident-leave",      "/resident/leave"),
    @("10","service-task",        "/service/task"),
    @("11","service-plan",        "/service/plan"),
    @("12","finance-bill",        "/finance/bill"),
    @("13","finance-prestored",   "/finance/prestored"),
    @("14","order-list",          "/order/list"),
    @("15","order-refund",        "/order/refund"),
    @("16","customer-list",       "/customer/list"),
    @("17","message-push",        "/message/push"),
    @("18","iot-device",          "/iot/device"),
    @("19","iot-alarm",           "/iot/alarm"),
    @("20","system-user",         "/system/user"),
    @("21","system-role",         "/system/role"),
    @("22","system-menu",         "/system/menu"),
    @("23","system-dept",         "/system/dept"),
    @("24","system-post",         "/system/post")
)

$results = @()
foreach ($p in $pages) {
    $num, $slug, $path = $p
    $file = Join-Path $out "$num-$slug.png"
    & node $ws navigate 0 "http://localhost$path" 2>&1 | Out-Null
    Start-Sleep -Seconds 4

    # 等待主内容渲染（登录页用 .login-card，后台用 .app-container）
    $detector = if ($path -eq "/login") { ".login-card" } else { ".app-container" }
    & node $ws wait-for 0 $detector 2>&1 | Out-Null
    Start-Sleep -Seconds 2

    # 采集渲染指标
    $probe = & node $ws eval 0 "JSON.stringify({t:document.querySelector('.page-title')?document.querySelector('.page-title').textContent.trim():'',r:document.querySelectorAll('.el-table__row').length,c:document.querySelectorAll('.stat-card').length,e:!!document.querySelector('.el-empty')})" 2>&1
    & node $ws screenshot 0 $file 2>&1 | Out-Null

    $size = if (Test-Path $file) { [math]::Round((Get-Item $file).Length/1KB) } else { 0 }
    $results += [PSCustomObject]@{
        File = "$num-$slug.png"
        Path = $path
        Rows = if ($probe -match '"r":(\d+)') { $Matches[1] } else { "?" }
        Cards = if ($probe -match '"c":(\d+)') { $Matches[1] } else { "?" }
        Empty = if ($probe -match '"e":(true|false)') { $Matches[1] } else { "?" }
        KB = $size
    }
}
$results | Format-Table -AutoSize | Out-String -Width 200
