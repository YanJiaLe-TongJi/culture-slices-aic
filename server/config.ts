import type {AIConfig} from './chat';

/** A provider key is never reused for a different endpoint. */
export function resolveAIConfig(env:Record<string,string|undefined>):AIConfig {
  if (env.AI_API_URL || env.AI_API_KEY || env.AI_MODEL) {
    return {url:env.AI_API_URL||'',key:env.AI_API_KEY||'',model:env.AI_MODEL||''};
  }
  return {url:'https://api.deepseek.com/chat/completions',key:env.DEEPSEEK_API_KEY||'',model:env.DEEPSEEK_MODEL||'deepseek-flash'};
}

export function publicAIStatus(config:AIConfig) {
  const configured=Boolean(config.url&&config.key&&config.model);
  let provider='AI';
  try {if(new URL(config.url).hostname==='api.deepseek.com')provider='DeepSeek';}catch{/* No private configuration in status. */}
  return {configured,provider:configured?provider:null};
}
