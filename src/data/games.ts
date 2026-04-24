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
  },
  {
    path: '/hanzi',
    name: 'hanzi',
    title: '汉字',
    description: '汉字认字练习',
    icon: '🀄',
    component: 'HanziView',
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
  return GAMES_REGISTRY.map((game) => ({
    path: game.path,
    name: game.name,
    component: () => import(`../views/${game.component}.vue`),
    meta: { title: game.title },
  }))
}
