import { getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/i18n/constants'

export type TemplateCopy = {
  hero: {
    badge: string
    title: string
    subtitle: string
    primary: string
    secondary: string
    skip: string
  }
  what: {
    eyebrow: string
    title: string
    body: string
    cards: { title: string; body: string }[]
  }
  start: {
    eyebrow: string
    title: string
    subtitle: string
    steps: { title: string; body: string }[]
  }
  patterns: {
    eyebrow: string
    title: string
    subtitle: string
    more: string
    items: { title: string; body: string; path: string }[]
  }
  later: {
    eyebrow: string
    title: string
    items: { title: string; body: string }[]
  }
  remove: {
    eyebrow: string
    title: string
    body: string
    steps: string[]
    note: string
  }
  footer: {
    brand: string
    why: string
    login: string
    signup: string
  }
  why: {
    eyebrow: string
    title: string
    subtitle: string
    introTitle: string
    introBody: string
    items: { title: string; analogy: string; lookHere: string; path: string }[]
    back: string
    start: string
  }
}

const en: TemplateCopy = {
  hero: {
    badge: 'A starter for students',
    title: 'A good first house for your project',
    subtitle:
      'This is not a finished product. It is a simple, working website with pages, sign-in, and a few rules that keep your code — and your AI assistant — from getting messy. You do not need to understand everything today.',
    primary: 'Create a test account',
    secondary: 'I already have one',
    skip: 'Show me how to start',
  },
  what: {
    eyebrow: 'What you cloned',
    title: 'Not a finished app. A solid baseline.',
    body: 'Think of this as a furnished apartment. The kitchen is already in the same place every time. You can paint the walls, add rooms, or throw the furniture out later.',
    cards: [
      {
        title: 'A real website',
        body: 'There are pages you can click. You can create an account and see a private dashboard. Nothing here is fake.',
      },
      {
        title: 'Repeating recipes',
        body: 'When we add a feature, we follow the same steps. That is what people mean by “patterns” — a recipe you reuse so you do not invent a new one every time.',
      },
      {
        title: 'Easier for you and AI',
        body: 'If the house is tidy, a coding assistant can find the kitchen. If every room is random, it guesses. Guesses go wrong.',
      },
    ],
  },
  start: {
    eyebrow: 'How to start',
    title: 'Five small steps. Stop whenever you want.',
    subtitle:
      'You do not need a job in software to do this. Read one step, do it, then come back.',
    steps: [
      {
        title: 'Look around',
        body: 'You are already looking at the running site. Click around. You will not break the internet.',
      },
      {
        title: 'Make a test account',
        body: 'Use any email you own. While you work on your own computer, extra “verify your email” checks are usually turned off.',
      },
      {
        title: 'Tell the AI what you are building',
        body: 'Ask your AI to run the getting-started skill. It will ask a few questions (web or mobile, accounts, database) and write the answers into AGENTS.md and CLAUDE.md.',
      },
      {
        title: 'Ask for one tiny change',
        body: 'Try: “Add a page at /hello that says hello.” Watch which files change. That is the pattern you will reuse.',
      },
      {
        title: 'Add a database when you need one',
        body: 'Copy .env.example to .env.local. For a free database on your machine, run docker compose up from the project root. You can do this later.',
      },
    ],
  },
  patterns: {
    eyebrow: 'The design choices',
    title: 'Four habits that keep the project calm',
    subtitle:
      'You do not have to memorize these. Just know they exist, so you or your AI can copy them.',
    more: 'A slower walkthrough',
    items: [
      {
        title: 'The kitchen and the pantry',
        body: 'A Service decides what is allowed. A Repository talks to the database. Keep those jobs separate and every change stays smaller.',
        path: 'apps/web-app/lib/services',
      },
      {
        title: 'One front door',
        body: 'API routes go through createRouteHandler. That helper checks who you are before the rest of the code runs.',
        path: 'apps/web-app/lib/auth/route-handler.ts',
      },
      {
        title: 'Pages ask the server. The server talks to the API.',
        body: 'Code that runs in the browser should not call /api itself. Use a server action plus secureFetch. Secrets stay off the public street.',
        path: 'apps/web-app/lib/serverUtils.ts',
      },
      {
        title: 'Check the form before you trust it',
        body: 'Zod schemas describe what valid data looks like. Types stay in sync automatically, so fewer surprises.',
        path: 'apps/web-app/lib/validators',
      },
    ],
  },
  later: {
    eyebrow: 'Not today',
    title: 'Things you can ignore until you need them',
    items: [
      {
        title: 'A database on the internet',
        body: 'Neon or Supabase will host Postgres for you. For learning, Docker on your machine is enough.',
      },
      {
        title: 'Real emails',
        body: 'Resend can send password-reset and “verify your email” messages. Skip this while you learn.',
      },
      {
        title: 'Putting it on the internet',
        body: 'Railway is a friendly host for this stack. Vercel also works. Wait until the app does something you want to show people.',
      },
    ],
  },
  remove: {
    eyebrow: 'When you are ready',
    title: 'This welcome page is designed to be thrown away',
    body: 'None of your real app lives in this folder. Login, signup, and the dashboard stay.',
    steps: [
      'Open apps/web-app/lib/config/featureToggles.ts and set templateWelcome to false.',
      'Delete the folder apps/web-app/template-welcome.',
      'Delete the folder apps/web-app/app/why.',
    ],
    note: 'That is the whole cleanup. Read the README inside template-welcome if you want it written down.',
  },
  footer: {
    brand: 'Starter template',
    why: 'Why these patterns',
    login: 'Sign in',
    signup: 'Sign up',
  },
  why: {
    eyebrow: 'Why the house is built this way',
    title: 'Same steps, every time',
    subtitle:
      'Beginners and AI assistants both do better when the next file has an obvious place to go. That is all “architecture” means here.',
    introTitle: 'A messy house is hard for everyone',
    introBody:
      'If login code lives in five different styles, you have to re-learn the project every day. Your AI has to guess. Guessing is how bugs show up. These four recipes are the opposite of guessing.',
    items: [
      {
        title: 'Service / repository',
        analogy:
          'The kitchen decides the meal. The pantry only stores food. If the pantry starts deciding meals, you can never find anything.',
        lookHere: 'Look here when you add a rule like “only you can edit your name”.',
        path: 'apps/web-app/lib/services/userService.ts',
      },
      {
        title: 'One API wrapper',
        analogy:
          'Every guest uses the same front door. The door checks ID. Nobody climbs through a window.',
        lookHere: 'Copy this wrapper when you add a new /api route.',
        path: 'apps/web-app/lib/auth/route-handler.ts',
      },
      {
        title: 'Server actions + secureFetch',
        analogy:
          'The browser asks a waiter. The waiter walks into the kitchen. Customers do not wander into the fridge.',
        lookHere: 'Use this from a server action, never from a client button directly.',
        path: 'apps/web-app/lib/serverUtils.ts',
      },
      {
        title: 'Zod schemas',
        analogy:
          'A bouncer with a list. If the name is missing, the person does not get in. The list is also the TypeScript type.',
        lookHere: 'Put new form rules next to the service they belong to, or in lib/validators.',
        path: 'apps/web-app/lib/services/userService.ts',
      },
    ],
    back: 'Back to the welcome page',
    start: 'Create a test account',
  },
}

const ja: TemplateCopy = {
  hero: {
    badge: '学生向けスターター',
    title: 'プロジェクトの、最初の家',
    subtitle:
      '完成したプロダクトではありません。ページ、ログイン、そしてコード（とAI）が散らからないための、いくつかのルールが入った動くウェブサイトです。今日、全部を理解する必要はありません。',
    primary: 'テスト用アカウントを作る',
    secondary: 'すでに持っている',
    skip: '始め方を見る',
  },
  what: {
    eyebrow: 'クローンしたもの',
    title: '完成品ではなく、土台です',
    body: '家具付きのアパートだと思ってください。キッチンの場所は毎回同じです。壁を塗っても、部屋を足しても、あとで家具を捨てても構いません。',
    cards: [
      {
        title: '本物のウェブサイト',
        body: 'クリックできるページがあります。アカウントを作って、自分だけのダッシュボードを見られます。見た目だけのデモではありません。',
      },
      {
        title: 'くり返すレシピ',
        body: '機能を足すとき、同じ手順を使います。それが「パターン」です。毎回新しいやり方を発明しないためのレシピです。',
      },
      {
        title: '自分にもAIにもやさしい',
        body: '家が整っていると、AIはキッチンを見つけられます。部屋がバラバラだと、推測します。推測はミスになります。',
      },
    ],
  },
  start: {
    eyebrow: '始め方',
    title: '小さな5ステップ。途中で止めて大丈夫です',
    subtitle:
      'ソフトウェアの仕事をしていなくても大丈夫です。1つ読んで、やって、戻ってきてください。',
    steps: [
      {
        title: 'まず見てみる',
        body: 'もうサイトは動いています。クリックしてみてください。壊れません。',
      },
      {
        title: 'テスト用アカウントを作る',
        body: '自分のメールアドレスで大丈夫です。自分のパソコンで動かすあいだは、メール確認はだいたいオフです。',
      },
      {
        title: 'AIに何を作るか伝える',
        body: 'AIに getting-started スキルを実行してもらってください。ウェブかモバイルか、アカウント、データベースなどを聞かれ、答えが AGENTS.md と CLAUDE.md に書かれます。',
      },
      {
        title: '小さな変更を1つ頼む',
        body: '「/hello に hello と出るページを足して」と頼んでみてください。どのファイルが変わったかを見てください。それが次も使う型です。',
      },
      {
        title: '必要になったらデータベース',
        body: '.env.example を .env.local にコピーします。自分のパソコンで無料のデータベースが欲しければ、プロジェクトの一番上で docker compose up です。あとでも大丈夫です。',
      },
    ],
  },
  patterns: {
    eyebrow: '設計の決めごと',
    title: 'プロジェクトを落ち着かせる4つの習慣',
    subtitle:
      '暗記しなくて大丈夫です。「ある」ことだけ知っておけば、自分やAIがコピーできます。',
    more: 'ゆっくりした解説',
    items: [
      {
        title: 'キッチンとパントリー',
        body: 'Service は「やってよいか」を決めます。Repository はデータベースと話します。仕事を分けると、変更が小さくなります。',
        path: 'apps/web-app/lib/services',
      },
      {
        title: '玄関はひとつ',
        body: 'APIルートは createRouteHandler を通ります。このヘルパーが、先に「誰か」を確認します。',
        path: 'apps/web-app/lib/auth/route-handler.ts',
      },
      {
        title: 'ページはサーバーに頼む。サーバーがAPIと話す。',
        body: 'ブラウザのコードから /api を直接叩かないでください。サーバーアクションと secureFetch を使います。秘密は表通りに出しません。',
        path: 'apps/web-app/lib/serverUtils.ts',
      },
      {
        title: '信じる前にフォームを確認する',
        body: 'Zod のスキーマが「正しいデータの形」を表します。型も自動で揃うので、びっくりが減ります。',
        path: 'apps/web-app/lib/validators',
      },
    ],
  },
  later: {
    eyebrow: '今日じゃなくていい',
    title: '必要になるまで無視してよいもの',
    items: [
      {
        title: 'インターネット上のデータベース',
        body: 'Neon や Supabase が Postgres を預かってくれます。学びのうちは、自分のパソコンの Docker で十分です。',
      },
      {
        title: '本物のメール',
        body: 'Resend はパスワード再設定やメール確認を送れます。学びのうちは飛ばして大丈夫です。',
      },
      {
        title: 'インターネットに出す',
        body: 'この構成なら Railway が扱いやすいです。Vercel も動きます。人に見せたいものができてからで十分です。',
      },
    ],
  },
  remove: {
    eyebrow: '準備ができたら',
    title: 'この案内ページは、捨てる前提です',
    body: '本物のアプリはこのフォルダにはありません。ログイン、サインアップ、ダッシュボードはそのまま残ります。',
    steps: [
      'apps/web-app/lib/config/featureToggles.ts を開き、templateWelcome を false にします。',
      'フォルダ apps/web-app/template-welcome を削除します。',
      'フォルダ apps/web-app/app/why を削除します。',
    ],
    note: '掃除はこれだけです。書いておきたい場合は template-welcome の README を見てください。',
  },
  footer: {
    brand: 'スターターテンプレート',
    why: 'このパターンの理由',
    login: 'サインイン',
    signup: 'サインアップ',
  },
  why: {
    eyebrow: '家をこう建てた理由',
    title: '毎回、同じ手順',
    subtitle:
      '次のファイルの置き場所が分かっていると、初心者にもAIにもやさしいです。ここで言う「設計」は、それだけです。',
    introTitle: '散らかった家は、誰にとってもつらい',
    introBody:
      'ログインの書き方が5種類あると、毎日プロジェクトを覚え直すことになります。AIも推測します。推測がバグになります。下の4つのレシピは、その反対です。',
    items: [
      {
        title: 'Service / Repository',
        analogy:
          'キッチンが献立を決める。パントリーは食材を置くだけ。パントリーが献立を決めだすと、何も見つかりません。',
        lookHere: '「自分の名前だけ変えられる」のようなルールを足すときに見ます。',
        path: 'apps/web-app/lib/services/userService.ts',
      },
      {
        title: 'ひとつのAPIラッパー',
        analogy:
          'お客はみんな同じ玄関を使う。玄関で身分を確認する。窓からは入りません。',
        lookHere: '新しい /api ルートを足すときは、このラッパーをコピーします。',
        path: 'apps/web-app/lib/auth/route-handler.ts',
      },
      {
        title: 'サーバーアクション + secureFetch',
        analogy:
          'お客はウェイターに頼む。ウェイターが厨房へ行く。お客が冷蔵庫を開けに行きません。',
        lookHere: 'サーバーアクションから使います。クライアントのボタンから直接は使いません。',
        path: 'apps/web-app/lib/serverUtils.ts',
      },
      {
        title: 'Zod スキーマ',
        analogy:
          'リストを持った受付。名前がなければ入れない。そのリストが TypeScript の型にもなります。',
        lookHere: '新しいフォームのルールは、そのサービスのそばか lib/validators に置きます。',
        path: 'apps/web-app/lib/services/userService.ts',
      },
    ],
    back: '案内ページに戻る',
    start: 'テスト用アカウントを作る',
  },
}

const copies: Record<Locale, TemplateCopy> = { en, ja }

export async function getTemplateCopy(): Promise<TemplateCopy> {
  const locale = (await getLocale()) as Locale
  return copies[locale] ?? copies.en
}
