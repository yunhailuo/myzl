/** Game metadata interface */
export interface GameMeta {
  /** Route path */
  path: string
  /** Route name */
  name: string
  /** Display title */
  title: string
  /** Description */
  description?: string
  /** Icon or emoji */
  icon?: string
  /** Component filename (without .vue extension) */
  component: string
  /** 
   * Store module loader for batch generation.
   * Returns a configured problem generator that respects current store settings.
   */
  batchStoreLoader?: () => Promise<{
    /** Generate a single problem with current store configuration */
    generateProblem: () => string
  }>
}

/**
 * Helper function to create a batch store loader from a store module path.
 * Automatically uses the module's createBatchGenerator function.
 */
function createBatchLoader<T extends { createBatchGenerator: () => () => string }>(
  importFn: () => Promise<T>,
): GameMeta['batchStoreLoader'] {
  return async () => {
    const module = await importFn()
    return { generateProblem: module.createBatchGenerator() }
  }
}

/**
 * Game registry
 * Games are ordered to match navigation menu and route definitions.
 * Add new games here - the system will automatically generate routes,
 * add navigation entries, and display them on the home page.
 */
export const GAMES_REGISTRY: GameMeta[] = [
  {
    path: '/addition-subtraction',
    name: 'addition-subtraction',
    title: '加减法',
    description: '加减法闪卡练习',
    icon: '🔢',
    component: 'AdditionSubtractionView',
    batchStoreLoader: createBatchLoader(() => import('../stores/additionSubtraction')),
  },
  {
    path: '/hanzi',
    name: 'hanzi',
    title: '汉字',
    description: '汉字认字练习',
    icon: '🀄',
    component: 'HanziView',
  },
  {
    path: '/hanzi-tool',
    name: 'hanzi-tool',
    title: '汉字查询',
    description: '查询汉字的拼音、笔顺和例词',
    icon: '🔍',
    component: 'HanziToolView',
  },
  {
    path: '/distributive-law',
    name: 'distributive-law',
    title: '分配律',
    description: '乘法分配律简便计算练习',
    icon: '✖️',
    component: 'DistributiveLawView',
    batchStoreLoader: createBatchLoader(() => import('../stores/distributiveLaw')),
  },
  {
    path: '/linear-equation',
    name: 'linear-equation',
    title: '一元一次方程',
    description: '移项与合并同类项练习',
    icon: '📐',
    component: 'LinearEquationView',
    batchStoreLoader: createBatchLoader(() => import('../stores/linearEquation')),
  },
]

/** Get game metadata by path */
export function getGameByPath(path: string): GameMeta | undefined {
  return GAMES_REGISTRY.find((game) => game.path === path)
}

/** Get game metadata by name */
export function getGameByName(name: string): GameMeta | undefined {
  return GAMES_REGISTRY.find((game) => game.name === name)
}

/** Generate Vue Router configurations from game registry */
export function generateRoutes() {
  return GAMES_REGISTRY.flatMap((game) => {
    const routes: Array<{
      path: string
      name: string
      component: () => Promise<{ default: unknown }>
      meta: { title: string; supportsBatch?: boolean }
    }> = [
      // Main view for single question practice
      {
        path: game.path,
        name: game.name,
        component: () => import(`../views/${game.component}.vue`),
        meta: {
          title: game.title,
          supportsBatch: !!game.batchStoreLoader,
        },
      },
    ]

    // Add batch route if store loader is provided
    if (game.batchStoreLoader) {
      routes.push({
        path: `${game.path}/batch`,
        name: `${game.name}-batch`,
        component: () => import('../views/BatchView.vue'),
        meta: {
          title: `${game.title} - 批量生成`,
        },
      })
    }

    return routes
  })
}
