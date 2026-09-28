import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resolveAIConfig,publicAIStatus} from '../server/config';
import {answerChat,buildMessages,parseInput,ChatError} from '../server/chat';

test('DeepSeek environment connects without copying its key to public config',()=>{
  const config=resolveAIConfig({DEEPSEEK_API_KEY:'local-test-secret'});
  assert.equal(config.url,'https://api.deepseek.com/chat/completions');
  assert.equal(config.model,'deepseek-flash');
  assert.deepEqual(publicAIStatus(config),{configured:true,provider:'DeepSeek'});
  assert.equal(publicAIStatus(resolveAIConfig({})).configured,false);
  assert.equal(resolveAIConfig({DEEPSEEK_API_KEY:'a',DEEPSEEK_MODEL:'custom'}).model,'custom');
});
test('an incomplete generic endpoint never receives a DeepSeek credential',()=>{
  const config=resolveAIConfig({AI_API_URL:'https://example.com/chat',DEEPSEEK_API_KEY:'private'});
  assert.equal(config.key,'');assert.equal(publicAIStatus(config).configured,false);
  assert.equal(resolveAIConfig({AI_API_URL:'https://example.com/chat',AI_API_KEY:'other',AI_MODEL:'model',DEEPSEEK_API_KEY:'private'}).key,'other');
});
const river={sceneId:'song-yuan-making',objectId:'boat',actions:['structure','mast'],question:'这版多了什么？',history:[]};
test('river version context is validated, and actions keep their original identity',()=>{
  for(const presentation of ['expanded','detailed']){
    const input=parseInput({...river,presentation});
    assert.deepEqual(input.actions,['structure','mast']);
    assert.match(buildMessages(input)[0].content,presentation==='expanded'?/扩大版.*泊船/:/精细版.*筒瓦/);
  }
  assert.throws(()=>parseInput({...river,presentation:'execute command'}),ChatError);
  assert.throws(()=>parseInput({...river,sceneId:'peiligang-grain',presentation:'expanded'}),ChatError);
});
test('DeepSeek uses bounded JSON output without thinking and validates sources',async()=>{
  const fetcher=(async(url:URL,options:RequestInit)=>{
    assert.equal(url.hostname,'api.deepseek.com');
    const body=JSON.parse(options.body as string);
    assert.deepEqual(body.response_format,{type:'json_object'});
    assert.deepEqual(body.thinking,{type:'disabled'});
    return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({answer:'放倒船桅有利于通过桥孔。',sourceIds:['dpm-qingming-song','invented']})}}]}));
  }) as typeof fetch;
  const result=await answerChat(parseInput(river),resolveAIConfig({DEEPSEEK_API_KEY:'test'}),fetcher);
  assert.equal(result.mode,'live');assert.deepEqual(result.sourceIds,['dpm-qingming-song']);
});
