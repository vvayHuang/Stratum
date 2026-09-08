import { defineNuxtPlugin, useRouter } from '#app';
import { useSupabaseSession } from '#imports';
import { watch } from 'vue';

// 登入後網址會留下 ?code=<授權碼>。
//
// supabase-js 交換完 code 其實有用 history.replaceState 清掉網址，但它跑在
// Vue Router 之前，router 隨後把自己記住的 fullPath（仍帶著 ?code=）同步回
// 網址列，等於又蓋了回去。
//
// 清理必須排在 app:mounted 之後 —— 在 plugin 階段呼叫 router.replace() 雖然
// 會執行，但緊接著的掛載流程會再次覆寫網址列。
//
// 另外只在 session 確實建立後才清，一來不會搶在 code 交換完成之前把它拿掉，
// 二來交換若真的失敗，code 會留在網址上而不是被默默抹掉。
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const session = useSupabaseSession();

  const stripAuthCode = () => {
    const route = router.currentRoute.value;
    if (!route.query.code) return;

    const query = { ...route.query };
    delete query.code;
    router.replace({ path: route.path, query, hash: route.hash });
  };

  nuxtApp.hook('app:mounted', () => {
    if (session.value) {
      stripAuthCode();
      return;
    }

    watch(session, (value) => {
      if (value) stripAuthCode();
    }, { once: true });
  });
});
