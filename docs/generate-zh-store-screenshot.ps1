Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$source = "C:\Users\ROG\Desktop\中文截图.jpg"
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $PSScriptRoot "screenshots"
$repoOut = Join-Path $outDir "04-ai-pilot-sidebar-zh-cn.jpg"
$desktopOut = "C:\Users\ROG\Desktop\AI-Pilot-中文商店截图-1280x800.jpg"

if (!(Test-Path $source)) {
  throw "Source screenshot not found: $source"
}
if (!(Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir | Out-Null
}

function New-Brush($hex) {
  return [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function New-Pen($hex, $width = 1) {
  return [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml($hex), $width)
}

function New-Font($size, $style = [System.Drawing.FontStyle]::Regular) {
  return [System.Drawing.Font]::new("Microsoft YaHei UI", [single]$size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Draw-RoundRect($g, $x, $y, $w, $h, $r, $brush, $pen = $null) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  if ($brush) { $g.FillPath($brush, $path) }
  if ($pen) { $g.DrawPath($pen, $path) }
  $path.Dispose()
}

function Draw-Text($g, $text, $x, $y, $size, $color = "#111827", $style = [System.Drawing.FontStyle]::Regular, $w = 600, $h = 80) {
  $font = New-Font $size $style
  $brush = New-Brush $color
  $format = [System.Drawing.StringFormat]::new()
  $format.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $g.DrawString($text, $font, $brush, [System.Drawing.RectangleF]::new($x, $y, $w, $h), $format)
  $format.Dispose()
  $brush.Dispose()
  $font.Dispose()
}

$bmp = [System.Drawing.Bitmap]::new(1280, 800, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.ColorTranslator]::FromHtml("#f6f8fb"))

Draw-RoundRect $g 56 48 1168 704 24 (New-Brush "#ffffff") (New-Pen "#d7dee8" 1)
Draw-RoundRect $g 56 48 1168 58 24 (New-Brush "#eef3f7")
$g.FillRectangle((New-Brush "#eef3f7"), 56, 76, 1168, 30)
Draw-RoundRect $g 86 66 14 14 7 (New-Brush "#ef4444")
Draw-RoundRect $g 110 66 14 14 7 (New-Brush "#f59e0b")
Draw-RoundRect $g 134 66 14 14 7 (New-Brush "#22c55e")
Draw-RoundRect $g 184 62 520 24 12 (New-Brush "#ffffff") (New-Pen "#d7dee8" 1)
Draw-Text $g "AI Pilot Sidebar" 206 65 12 "#7a8797" ([System.Drawing.FontStyle]::Regular) 240 24

Draw-Text $g "AI Pilot Sidebar" 105 170 42 "#0f172a" ([System.Drawing.FontStyle]::Bold) 560 58
Draw-Text $g "固定在 Chrome 右侧的轻量多 AI 侧边栏工具" 108 238 24 "#334155" ([System.Drawing.FontStyle]::Regular) 560 42
Draw-Text $g "快速切换常用 AI 官网和自定义 AI 网站，复用你当前浏览器中的登录状态。" 108 296 20 "#475569" ([System.Drawing.FontStyle]::Regular) 560 92

$features = @(
  "官方 Chrome Side Panel",
  "多 AI 菜单快速切换",
  "默认 AI 和记住上次使用",
  "设置只保存在本机"
)

for ($i = 0; $i -lt $features.Count; $i++) {
  $y = 424 + ($i * 48)
  Draw-RoundRect $g 108 $y 24 24 12 (New-Brush "#0f766e")
  Draw-Text $g "✓" 113 ($y + 1) 16 "#ffffff" ([System.Drawing.FontStyle]::Bold) 24 24
  Draw-Text $g $features[$i] 148 ($y - 1) 20 "#0f172a" ([System.Drawing.FontStyle]::Regular) 460 32
}

$img = [System.Drawing.Image]::FromFile($source)
$targetH = 660
$targetW = [int]($img.Width * $targetH / $img.Height)
$x = 760
$y = 82
Draw-RoundRect $g ($x - 10) ($y - 10) ($targetW + 20) ($targetH + 20) 18 (New-Brush "#ffffff") (New-Pen "#cbd5e1" 1)
$g.DrawImage($img, $x, $y, $targetW, $targetH)
$img.Dispose()

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$params = [System.Drawing.Imaging.EncoderParameters]::new(1)
$params.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, 95L)
$bmp.Save($repoOut, $encoder, $params)
$params.Dispose()
$g.Dispose()
$bmp.Dispose()

try {
  Copy-Item -LiteralPath $repoOut -Destination $desktopOut -Force
} catch {
  $desktopOut = ""
}

$check = [System.Drawing.Image]::FromFile($repoOut)
[pscustomobject]@{
  RepoPath = $repoOut
  DesktopPath = $desktopOut
  Width = $check.Width
  Height = $check.Height
  PixelFormat = $check.PixelFormat
  Length = (Get-Item $repoOut).Length
}
$check.Dispose()
