import { useEffect, useRef } from 'react';
import { scene, type ZoneId, type ObjectId } from './content';
import type { Progress } from './state';

// Optional browser capability; no dependency, no effect in unsupported browsers.
interface ModelContext {
  registerTool(tool: { name: string; title: string; description: string; inputSchema: object; annotations: object; execute: (input: unknown) => unknown }, options: { signal: AbortSignal }): void | Promise<void>;
}
export function useSceneTool(progress: Progress, selected: ObjectId | null, zone:ZoneId|null) {
  const snapshot = useRef({ sceneId: scene.id, selectedObjectId: selected, zoneId:zone, progress });
  snapshot.current = { sceneId: scene.id, selectedObjectId: selected, zoneId:zone, progress };
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(context.registerTool({
        name: 'read_culture_scene', title: '查看文化切片探索状态',
        description: '读取当前文化切片、选中的物件与已完成操作，不更改场景或发起AI请求。',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute(input: unknown) {
          if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('此工具不接受参数。');
          return structuredClone(snapshot.current);
        }
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* Browser-specific optional capability must not block exploration. */ }
    return () => lifecycle.abort();
  }, []);
}
