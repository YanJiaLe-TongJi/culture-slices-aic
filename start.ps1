$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$taskNode = (Get-Command node -ErrorAction Stop).Source
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules/tsx/dist/cli.mjs'))) {
    $taskPnpm = Get-Command pnpm -ErrorAction SilentlyContinue
    if ($taskPnpm) {
        & $taskPnpm.Source install --frozen-lockfile
    } else {
        throw 'Please install pnpm 11.19.0, then run pnpm install --frozen-lockfile.'
    }
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
}
& $taskNode 'node_modules/tsx/dist/cli.mjs' 'server/index.ts'
