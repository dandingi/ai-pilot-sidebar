Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $PSScriptRoot "screenshots"
if (!(Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir | Out-Null
}

function New-Canvas {
  $bmp = [System.Drawing.Bitmap]::new(1280, 800, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
  $g.Clear([System.Drawing.Color]::FromArgb(246, 248, 251))
  return @{ Bitmap = $bmp; Graphics = $g }
}

function Brush($hex) {
  return [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function Pen($hex, $width = 1) {
  return [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml($hex), $width)
}

function Font($size, $style = [System.Drawing.FontStyle]::Regular) {
  return [System.Drawing.Font]::new("Segoe UI", $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
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

function Draw-Text($g, $text, $x, $y, $size, $color = "#111827", $style = [System.Drawing.FontStyle]::Regular, $w = 1000, $h = 100) {
  if ([double]$size -le 0) {
    throw "Invalid font size '$size' for text '$text' at $x,$y"
  }
  $font = [System.Drawing.Font]::new("Segoe UI", [single]$size, [System.Drawing.FontStyle]$style, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = Brush $color
  $format = [System.Drawing.StringFormat]::new()
  $format.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $rect = [System.Drawing.RectangleF]::new($x, $y, $w, $h)
  $g.DrawString($text, $font, $brush, $rect, $format)
  $font.Dispose()
  $brush.Dispose()
  $format.Dispose()
}

function Draw-Icon($g, $x, $y, $size) {
  $iconPath = Join-Path $root "assets\icons\icon-128.png"
  $img = [System.Drawing.Image]::FromFile($iconPath)
  $g.DrawImage($img, $x, $y, $size, $size)
  $img.Dispose()
}

function Draw-BrowserShell($g) {
  Draw-RoundRect $g 56 48 1168 704 22 (Brush "#ffffff") (Pen "#d7dee8" 1)
  Draw-RoundRect $g 56 48 1168 58 22 (Brush "#eef3f7")
  $g.FillRectangle((Brush "#eef3f7"), 56, 76, 1168, 30)
  Draw-RoundRect $g 86 66 14 14 7 (Brush "#ef4444")
  Draw-RoundRect $g 110 66 14 14 7 (Brush "#f59e0b")
  Draw-RoundRect $g 134 66 14 14 7 (Brush "#22c55e")
  Draw-RoundRect $g 184 62 620 24 12 (Brush "#ffffff") (Pen "#d7dee8" 1)
  Draw-Text $g "chrome://current-page" 206 65 12 "#7a8797" 0 300 24
}

function Draw-WebPageMock($g, $x, $y, $w, $h) {
  Draw-Text $g "Research workspace" ($x + 34) ($y + 42) 28 "#0f172a" ([System.Drawing.FontStyle]::Bold) 420 48
  Draw-Text $g "Keep your page open while switching between your AI tools in the side panel." ($x + 34) ($y + 86) 17 "#64748b" 0 520 54
  for ($i = 0; $i -lt 3; $i++) {
    $cardY = $y + 170 + ($i * 118)
    Draw-RoundRect $g ($x + 34) $cardY ($w - 80) 86 12 (Brush "#f8fafc") (Pen "#e2e8f0" 1)
    Draw-RoundRect $g ($x + 58) ($cardY + 22) 160 12 6 (Brush "#cbd5e1")
    Draw-RoundRect $g ($x + 58) ($cardY + 48) ($w - 210) 10 5 (Brush "#e2e8f0")
  }
}

function Draw-PanelBase($g, $x, $y, $w, $h, $model = "ChatGPT") {
  Draw-RoundRect $g $x $y $w $h 8 (Brush "#ffffff") (Pen "#006062" 3)
  $g.FillRectangle((Brush "#006062"), $x + 3, $y + 3, $w - 6, 34)
  Draw-RoundRect $g ($x + 14) ($y + 8) 32 24 6 (Brush "#1f797c")
  $menuPen = Pen "#ffffff" 2
  $g.DrawLine($menuPen, $x + 22, $y + 15, $x + 38, $y + 15)
  $g.DrawLine($menuPen, $x + 22, $y + 20, $x + 38, $y + 20)
  $g.DrawLine($menuPen, $x + 22, $y + 25, $x + 38, $y + 25)
  $menuPen.Dispose()
  Draw-RoundRect $g ($x + 118) ($y + 8) 150 24 12 (Brush "#197a7b") (Pen "#4ca5a6" 1)
  Draw-Text $g $model ($x + 152) ($y + 11) 13 "#ffffff" ([System.Drawing.FontStyle]::Bold) 120 24
  Draw-RoundRect $g ($x + 136) ($y + 16) 8 8 4 (Brush "#12d6a0")
}

function Draw-ChatMock($g, $x, $y, $w, $h) {
  Draw-Text $g "ChatGPT" ($x + 28) ($y + 76) 24 "#111827" ([System.Drawing.FontStyle]::Bold) 240 36
  Draw-RoundRect $g ($x + 28) ($y + 130) ($w - 56) 74 14 (Brush "#f8fafc") (Pen "#e2e8f0" 1)
  Draw-Text $g "Ask anything from the side panel." ($x + 48) ($y + 152) 15 "#475569" 0 ($w - 96) 30
  Draw-RoundRect $g ($x + 28) ($y + 234) ($w - 56) 104 14 (Brush "#eefdf8") (Pen "#ccfbf1" 1)
  Draw-Text $g "AI Pilot Sidebar keeps your official AI websites one click away." ($x + 48) ($y + 258) 15 "#0f766e" 0 ($w - 96) 52
  Draw-RoundRect $g ($x + 28) ($y + $h - 86) ($w - 56) 48 24 (Brush "#f8fafc") (Pen "#e2e8f0" 1)
  Draw-Text $g "Message ChatGPT..." ($x + 50) ($y + $h - 72) 14 "#94a3b8" 0 220 26
}

function Draw-AiRail($g, $x, $y, $w, $h) {
  Draw-RoundRect $g $x $y $w $h 8 (Brush "#ffffff") (Pen "#d7dee8" 1)
  $rect = [System.Drawing.Rectangle]::new($x, $y, $w, 150)
  $grad = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, [System.Drawing.ColorTranslator]::FromHtml("#ef4444"), [System.Drawing.ColorTranslator]::FromHtml("#2563eb"), 35)
  $g.FillRectangle($grad, $rect)
  $grad.Dispose()
  Draw-Icon $g ($x + 24) ($y + 54) 58
  Draw-Text $g "AI Pilot" ($x + 96) ($y + 62) 30 "#ffffff" ([System.Drawing.FontStyle]::Bold) 150 42
  Draw-Text $g "Multi-AI Side Panel" ($x + 98) ($y + 100) 13 "#f8fafc" 0 150 24
  $names = @("ChatGPT", "Writing AI", "Research AI", "Coding AI", "Custom AI")
  $letters = @("C", "W", "R", "C", "+")
  for ($i = 0; $i -lt $names.Count; $i++) {
    $rowY = $y + 164 + ($i * 46)
    $active = $i -eq 0
    Draw-RoundRect $g ($x + 10) $rowY ($w - 20) 40 5 (Brush ($(if ($active) { "#f1f5f9" } else { "#ffffff" })))
    Draw-RoundRect $g ($x + 26) ($rowY + 9) 22 22 5 (Brush ($(if ($active) { "#10a37f" } else { "#eef4f7" })))
    Draw-Text $g $letters[$i] ($x + 33) ($rowY + 12) 10 ($(if ($active) { "#ffffff" } else { "#0f172a" })) ([System.Drawing.FontStyle]::Bold) 18 18
    Draw-Text $g $names[$i] ($x + 66) ($rowY + 9) 13 "#111827" 0 ($w - 88) 26
  }
  Draw-RoundRect $g ($x + 10) ($y + $h - 58) ($w - 20) 44 5 (Brush "#ffffff")
  Draw-Text $g "Settings" ($x + 28) ($y + $h - 46) 14 "#111827" 0 160 28
}

function Draw-SettingsPanel($g, $x, $y, $w, $h) {
  Draw-RoundRect $g $x $y $w $h 8 (Brush "#ffffff") (Pen "#d7dee8" 1)
  $rect = [System.Drawing.Rectangle]::new($x, $y, $w, 92)
  $grad = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, [System.Drawing.ColorTranslator]::FromHtml("#ef4444"), [System.Drawing.ColorTranslator]::FromHtml("#2563eb"), 35)
  $g.FillRectangle($grad, $rect)
  $grad.Dispose()
  Draw-Icon $g ($x + 20) ($y + 24) 44
  Draw-Text $g "Settings" ($x + 78) ($y + 24) 22 "#ffffff" ([System.Drawing.FontStyle]::Bold) 180 34
  Draw-Text $g "AI Pilot" ($x + 80) ($y + 54) 12 "#f8fafc" 0 120 22

  $sectionY = $y + 112
  Draw-Text $g "Startup" ($x + 20) $sectionY 15 "#0f172a" ([System.Drawing.FontStyle]::Bold) 160 28
  Draw-Text $g "Default AI" ($x + 20) ($sectionY + 38) 12 "#64748b" 0 120 22
  Draw-RoundRect $g ($x + 20) ($sectionY + 62) ($w - 40) 38 7 (Brush "#ffffff") (Pen "#dfe8ef" 1)
  Draw-Text $g "ChatGPT" ($x + 34) ($sectionY + 72) 13 "#111827" 0 160 22
  Draw-RoundRect $g ($x + 20) ($sectionY + 118) ($w - 40) 58 7 (Brush "#f7fafc")
  Draw-Text $g "Remember last used" ($x + 34) ($sectionY + 128) 13 "#111827" ([System.Drawing.FontStyle]::Bold) 180 24
  Draw-Text $g "When enabled, the last selected AI opens first." ($x + 34) ($sectionY + 150) 12 "#64748b" 0 260 22
  Draw-RoundRect $g ($x + $w - 64) ($sectionY + 136) 20 20 4 (Brush "#ffffff") (Pen "#94a3b8" 1)

  $listY = $sectionY + 210
  Draw-Text $g "AI List" ($x + 20) $listY 15 "#0f172a" ([System.Drawing.FontStyle]::Bold) 140 28
  Draw-RoundRect $g ($x + 20) ($listY + 36) ($w - 40) 250 7 (Brush "#ffffff") (Pen "#eef2f5" 1)
  $ais = @("ChatGPT", "Writing AI", "Research AI", "Custom AI")
  for ($i=0; $i -lt $ais.Count; $i++) {
    $rowY = $listY + 48 + ($i * 56)
    Draw-RoundRect $g ($x + 34) ($rowY + 8) 24 24 5 (Brush "#eef4f7")
    Draw-Text $g $ais[$i] ($x + 70) ($rowY + 6) 13 "#111827" ([System.Drawing.FontStyle]::Bold) 160 22
    Draw-Text $g "Side panel" ($x + 70) ($rowY + 28) 11 "#78909c" 0 120 18
    Draw-RoundRect $g ($x + $w - 118) ($rowY + 10) 52 26 6 (Brush "#f1f5f8")
    Draw-Text $g "Hide" ($x + $w - 105) ($rowY + 15) 12 "#2368a2" 0 40 18
  }
}

function Save-Shot($canvas, $path) {
  $canvas.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Graphics.Dispose()
  $canvas.Bitmap.Dispose()
}

$c = New-Canvas
$g = $c.Graphics
Draw-BrowserShell $g
Draw-WebPageMock $g 80 110 760 620
Draw-PanelBase $g 845 92 336 610 "ChatGPT"
Draw-ChatMock $g 845 92 336 610
Draw-Text $g "AI Pilot Sidebar" 110 642 38 "#0f172a" ([System.Drawing.FontStyle]::Bold) 460 52
Draw-Text $g "Switch between your preferred AI websites in a fixed Chrome side panel." 112 694 20 "#475569" 0 680 58
Save-Shot $c (Join-Path $outDir "01-ai-pilot-sidebar-main-en.png")

$c = New-Canvas
$g = $c.Graphics
Draw-BrowserShell $g
Draw-WebPageMock $g 80 110 660 620
Draw-PanelBase $g 790 92 390 610 "ChatGPT"
Draw-ChatMock $g 790 92 390 610
Draw-AiRail $g 790 92 256 610
Draw-Text $g "Switch AI websites instantly" 112 638 38 "#0f172a" ([System.Drawing.FontStyle]::Bold) 700 52
Draw-Text $g "Open your AI menu, choose a model, and keep working on the same page." 114 690 20 "#475569" 0 640 58
Save-Shot $c (Join-Path $outDir "02-ai-pilot-sidebar-menu-en.png")

$c = New-Canvas
$g = $c.Graphics
Draw-BrowserShell $g
Draw-WebPageMock $g 80 110 650 620
Draw-PanelBase $g 790 92 390 610 "ChatGPT"
Draw-SettingsPanel $g 790 92 390 610
Draw-Text $g "Simple settings, local preferences" 112 638 36 "#0f172a" ([System.Drawing.FontStyle]::Bold) 620 52
Draw-Text $g "Set your default AI, remember the last used model, and customize your AI list." 114 690 20 "#475569" 0 650 58
Save-Shot $c (Join-Path $outDir "03-ai-pilot-sidebar-settings-en.png")

Get-ChildItem $outDir -Filter "*.png" | Select-Object FullName,Length,LastWriteTime
