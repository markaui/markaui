import type { FamilyDef } from "./types";

/**
 * Component families — similar components grouped onto ONE page
 * (analysed from shadcn/ui, Ant Design, MUI and Mantine doc patterns).
 *
 * Rules:
 *  - memberIds reference REAL doc ids (never aliases — aliases resolve here
 *    automatically via ALIAS_TO_REAL in registry/index.ts).
 *  - every real doc must belong to exactly one family (validated in index.ts).
 */
export const FAMILIES: FamilyDef[] = [
  /* ------------------------------- Core ------------------------------- */
  {
    id: "buttons",
    name: "Buttons & Links",
    category: "core",
    description:
      "Every clickable action primitive — buttons in all variants and sizes, icon-only buttons, joined button groups and styled anchor links.",
    memberIds: ["button", "icon-button", "button-group", "link"],
  },
  {
    id: "badges-avatars",
    name: "Badges & Avatars",
    category: "core",
    description:
      "Small identity and status surfaces — labels, pills and counts next to user avatars with fallback initials and images.",
    memberIds: ["badge", "avatar"],
  },
  {
    id: "progress-loaders",
    name: "Progress & Loaders",
    category: "core",
    description:
      "Communicate waiting and completion — spinners, shimmer skeletons, linear bars and circular/radial progress rings.",
    memberIds: ["progress", "circular-progress", "spinner", "skeleton"],
  },
  {
    id: "floating-layers",
    name: "Tooltips & Popovers",
    category: "core",
    description:
      "Anchored floating layers — lightweight tooltips, rich popovers and hover previews, all positioned with Radix and gold-tuned.",
    memberIds: ["tooltip", "popover", "hover-card"],
  },
  {
    id: "separator",
    name: "Separator",
    category: "core",
    description: "Horizontal and vertical hairlines to divide content — solid, dashed and gradient variants.",
    memberIds: ["separator"],
  },

  /* ------------------------------- Forms ------------------------------ */
  {
    id: "text-inputs",
    name: "Text Inputs",
    category: "forms",
    description:
      "Every single-value text entry field — plain inputs, multiline textareas, password and search fields, numbers, OTP codes, field groups and labels.",
    memberIds: [
      "input",
      "textarea",
      "password-input",
      "search-input",
      "number-input",
      "otp-input",
      "input-group",
      "label",
    ],
  },
  {
    id: "selection-controls",
    name: "Checkboxes, Radios & Switches",
    category: "forms",
    description:
      "Binary and multi-choice selection — checkboxes, radio groups and on/off switches with cards, descriptions and validation states.",
    memberIds: ["checkbox", "radio", "radio-group", "switch"],
  },
  {
    id: "toggles-sliders",
    name: "Toggles & Sliders",
    category: "forms",
    description:
      "Pressed-state toggles, toggle groups and draggable sliders — single thumb and dual-thumb range selection.",
    memberIds: ["toggle", "toggle-group", "slider", "range-slider"],
  },
  {
    id: "selects-comboboxes",
    name: "Selects & Comboboxes",
    category: "forms",
    description:
      "Pick from lists — native-feeling selects, multi-selects with chips, searchable comboboxes and type-ahead autocompletion.",
    memberIds: ["select", "multi-select", "combobox", "autocomplete"],
  },
  {
    id: "date-time-pickers",
    name: "Date & Time",
    category: "forms",
    description:
      "Calendar-based selection — single date, date range, time, combined date-time pickers and the raw calendar grid.",
    memberIds: ["date-picker", "date-range-picker", "time-picker", "date-time-picker", "calendar"],
  },
  {
    id: "form-composition",
    name: "Form Composition",
    category: "forms",
    description:
      "Assemble accessible forms — react-hook-form wiring, labelled field wrappers, sectioned layouts and inline error messages.",
    memberIds: ["form", "form-field", "form-section", "field-error"],
  },
  {
    id: "uploads-pickers",
    name: "File & Color Pickers",
    category: "forms",
    description:
      "Rich input surfaces — drag-and-drop file uploads and a canvas-based color picker with swatches and alpha.",
    memberIds: ["file-upload", "dropzone", "color-picker", "avatar-picker"],
  },

  /* ---------------------------- Navigation ----------------------------- */
  {
    id: "app-chrome",
    name: "App Chrome",
    category: "navigation",
    description:
      "The big structural pieces of an application shell — responsive navbar with mobile sheet, the full sidebar system and hover navigation menus.",
    memberIds: ["navbar", "sidebar", "navigation-menu"],
  },
  {
    id: "wayfinding",
    name: "Wayfinding",
    category: "navigation",
    description:
      "Help users know where they are — breadcrumbs, tabbed views, numbered pagination and multi-step wizards.",
    memberIds: ["breadcrumb", "tabs", "pagination", "stepper"],
  },
  {
    id: "menus",
    name: "Menus",
    category: "navigation",
    description:
      "Action lists on triggers — dropdown menus, standalone menus, right-click context menus and full-height menu bars.",
    memberIds: ["dropdown-menu", "menu", "context-menu", "menubar"],
  },
  {
    id: "command-interfaces",
    name: "Command Interfaces",
    category: "navigation",
    description:
      "Keyboard-first command menu (⌘K) with fuzzy search, grouped actions and nested pages.",
    memberIds: ["command-menu"],
  },

  /* ------------------------------ Layout ------------------------------- */
  {
    id: "structure",
    name: "Structure",
    category: "layout",
    description:
      "Layout primitives — containers, stacks, grids, flex rows/columns, boxes, spacers, sections and aspect-ratio frames.",
    memberIds: ["container", "stack", "grid", "flex", "box", "spacer", "section", "content", "aspect-ratio"],
  },
  {
    id: "scroll-split",
    name: "Scroll & Split",
    category: "layout",
    description:
      "Viewport management — styled scroll areas, resizable panel groups with handles and split-pane views.",
    memberIds: ["scroll-area", "resizable", "split-pane"],
  },
  {
    id: "cards-panels",
    name: "Cards & Panels",
    category: "layout",
    description:
      "Content containers — composed cards with header/content/action slots, expandable accordions, collapsibles and lists.",
    memberIds: ["card", "accordion", "collapsible", "list"],
  },
  {
    id: "content-blocks",
    name: "Content Blocks",
    category: "layout",
    description:
      "Ready-made prose and message blocks — empty states, callouts, announcements, quotes, code blocks, markdown and clamped rich text.",
    memberIds: [
      "empty-state",
      "callout",
      "announcement",
      "quote",
      "code-block",
      "markdown",
      "rich-text",
    ],
  },
  {
    id: "media",
    name: "Media",
    category: "layout",
    description: "Media playback and browsing — images with zoom, video and audio players and touch carousels.",
    memberIds: ["image", "video", "audio", "carousel"],
  },

  /* ------------------------------ Overlay ------------------------------ */
  {
    id: "dialogs-modals",
    name: "Dialogs & Modals",
    category: "overlay",
    description:
      "Blocking conversations — standard dialogs, unstyled modals, confirmation alerts with intent, and full-screen lightboxes.",
    memberIds: ["dialog", "modal", "alert-dialog", "confirm-dialog", "lightbox"],
  },
  {
    id: "drawers-sheets",
    name: "Drawers & Sheets",
    category: "overlay",
    description:
      "Edge-anchored sliding panels — side drawers, mobile-first sheets and bottom sheets built on vaul.",
    memberIds: ["drawer", "sheet", "bottom-sheet"],
  },
  {
    id: "toasts-notifications",
    name: "Toasts & Notifications",
    category: "overlay",
    description:
      "Out-of-band messages — stacked toasts with actions and swipe dismiss, plus in-app notification lists.",
    memberIds: ["toast", "notification"],
  },

  /* --------------------------- Data Display ---------------------------- */
  {
    id: "tables-grids",
    name: "Tables & Grids",
    category: "data",
    description:
      "Tabular data at every level — plain tables, TanStack-powered data tables with sort/filter/pagination, editable data grids and hierarchical trees.",
    memberIds: ["table", "data-table", "data-grid", "tree"],
  },
  {
    id: "stats-kpis",
    name: "Stats & KPIs",
    category: "data",
    description:
      "Numbers that matter — single stat tiles, grouped stat rows and trend-aware KPI blocks.",
    memberIds: ["stat", "stat-group", "kpi"],
  },
  {
    id: "timelines-feeds",
    name: "Timelines & Feeds",
    category: "data",
    description:
      "Chronological data — vertical timelines with icons and variants plus live activity feeds with avatars and timestamps.",
    memberIds: ["timeline", "activity-feed"],
  },
  {
    id: "data-misc",
    name: "Tags, Ratings & More",
    category: "data",
    description:
      "Miscellaneous data display — key-value description lists, tags and chips, star ratings and a full calendar month view.",
    memberIds: ["description-list", "tag", "rating", "calendar-view"],
  },

  /* ------------------------------- Charts ------------------------------ */
  {
    id: "chart-foundations",
    name: "Chart Foundations",
    category: "charts",
    description:
      "The shared chart system — theme-aware Recharts wrapper plus tiny sparklines and mini-charts for dense UIs.",
    memberIds: ["chart", "sparkline"],
  },
  {
    id: "cartesian-charts",
    name: "Cartesian Charts",
    category: "charts",
    description:
      "X/Y plots — lines, areas, vertical/horizontal/stacked/grouped bars, combos, steps and range bars.",
    memberIds: [
      "line-chart",
      "area-chart",
      "bar-chart",
      "horizontal-bar-chart",
      "stacked-bar-chart",
      "grouped-bar-chart",
      "column-chart",
      "combo-chart",
      "step-chart",
      "range-chart",
    ],
  },
  {
    id: "circular-charts",
    name: "Circular & Radial",
    category: "charts",
    description:
      "Round visualizations — pies, donuts, radar/spider charts, radial bars and gauge/speedometer dials.",
    memberIds: ["piechart", "donutchart", "radarchart", "radialchart", "gaugechart"],
  },
  {
    id: "distribution-charts",
    name: "Distribution",
    category: "charts",
    description:
      "Understand spread and clusters — histograms, box plots, scatter and bubble charts.",
    memberIds: ["histogram", "boxplot", "scatterchart", "bubblechart"],
  },
  {
    id: "flow-charts",
    name: "Flows & Hierarchies",
    category: "charts",
    description:
      "Part-to-whole and flow — treemaps, sankeys, waterfalls, funnels and network graphs.",
    memberIds: ["treemap", "sankeychart", "waterfallchart", "funnelchart", "networkchart"],
  },
  {
    id: "time-charts",
    name: "Time & Financial",
    category: "charts",
    description:
      "Time-series specialists — candlestick/OHLC charts, gantt timelines and heatmaps.",
    memberIds: ["candlestickchart", "ganttchart", "heatmap"],
  },

  /* ------------------------------ Advanced ----------------------------- */
  {
    id: "data-controls",
    name: "Data Controls",
    category: "advanced",
    description:
      "Filter, sort and manipulate datasets — filter bars and panels, sort controls, view switchers, bulk actions, search filters, query builder and data toolbars.",
    memberIds: [
      "filter-bar",
      "filter-panel",
      "sort-control",
      "view-switcher",
      "bulk-actions",
      "search-filter",
      "query-builder",
      "data-toolbar",
    ],
  },
  {
    id: "workspaces",
    name: "Workspaces",
    category: "advanced",
    description:
      "Full working surfaces — kanban boards, calendar schedulers, file managers and the ⌘K command palette.",
    memberIds: ["kanban", "calendar-scheduler", "file-manager", "command-palette"],
  },
  {
    id: "editors",
    name: "Editors & Viewers",
    category: "advanced",
    description:
      "Authoring and inspection — rich text editor, code editor with syntax modes, JSON tree viewer and side-by-side diff viewer.",
    memberIds: ["rich-text-editor", "code-editor", "json-viewer", "diff-viewer"],
  },
  {
    id: "logs-terminals",
    name: "Logs & Terminals",
    category: "advanced",
    description:
      "Operational observability — log viewers with levels, an interactive terminal emulator and structured activity logs.",
    memberIds: ["log-viewer", "terminal", "activity-log"],
  },

  /* ------------------------------ Feedback ----------------------------- */
  {
    id: "alerts",
    name: "Alerts",
    category: "feedback",
    description:
      "Inline contextual messages — the base alert plus success, error, warning and info presets with icons and actions.",
    memberIds: ["alert", "success-message", "error-message", "warning-message", "info-message"],
  },
  {
    id: "status-views",
    name: "Status Views",
    category: "feedback",
    description:
      "Whole-region states — loading, error and offline views with recovery actions.",
    memberIds: ["loading-state", "error-state", "offline-state"],
  },

  /* ----------------------------- E-commerce ---------------------------- */
  {
    id: "products",
    name: "Products",
    category: "ecommerce",
    description:
      "Merchandising surfaces — product cards, grid layouts, image galleries and product carousels.",
    memberIds: ["product-card", "product-grid", "product-gallery", "product-carousel"],
  },
  {
    id: "pricing",
    name: "Pricing",
    category: "ecommerce",
    description:
      "Money display — formatted prices, price ranges and quantity steppers.",
    memberIds: ["price", "price-range", "quantity-selector"],
  },
  {
    id: "cart",
    name: "Cart",
    category: "ecommerce",
    description: "Cart building blocks — line items with quantity/remove and the order summary panel.",
    memberIds: ["cart-item", "cart-summary"],
  },
  {
    id: "checkout-orders",
    name: "Checkout & Orders",
    category: "ecommerce",
    description:
      "Complete the purchase — responsive multi-section checkout form, order status tracker and delivery timeline.",
    memberIds: ["checkout-form", "order-status", "order-timeline"],
  },

  /* -------------------------------- Auth ------------------------------- */
  {
    id: "auth-forms",
    name: "Sign In & Sign Up",
    category: "auth",
    description:
      "Complete credential flows — login, registration, forgot-password and reset-password forms with validation and social slots.",
    memberIds: ["login-form", "signup-form", "forgot-password-form", "reset-password-form"],
  },
  {
    id: "auth-verification",
    name: "Verification & Security",
    category: "auth",
    description:
      "Prove identity — OTP verification, two-factor authentication and WebAuthn passkey buttons.",
    memberIds: ["otp-verification", "two-factor-auth", "passkey-button"],
  },
  {
    id: "auth-shell",
    name: "Layouts & Social",
    category: "auth",
    description:
      "Auth page scaffolding — split-panel auth layouts and provider sign-in buttons.",
    memberIds: ["auth-layout", "social-login"],
  },

  /* ------------------------------ Dashboard ---------------------------- */
  {
    id: "dashboard-surfaces",
    name: "Dashboard Surfaces",
    category: "dashboard",
    description:
      "Whole dashboard compositions — the overview page and the 12-column responsive dashboard grid system.",
    memberIds: ["dashboard", "dashboard-grid"],
  },
  {
    id: "metric-cards",
    name: "Metric & Stat Cards",
    category: "dashboard",
    description:
      "Dashboard card widgets — metric cards with deltas, stat cards with progress, KPI grids, chart cards and activity cards.",
    memberIds: ["metric-card", "stats-card", "kpi-grid", "chart-card", "activity-card"],
  },
  {
    id: "dashboard-widgets",
    name: "Dashboard Widgets",
    category: "dashboard",
    description:
      "Supporting widgets — recently-viewed lists, quick-action launchers and notification centers.",
    memberIds: ["recent-items", "quick-actions", "notification-center"],
  },

  /* ---------------------------- Developer/Util ------------------------- */
  {
    id: "copy-kbd",
    name: "Copy & Shortcuts",
    category: "utility",
    description:
      "Copy affordances and keyboard hints — copy buttons, copyable text and keyboard shortcut/kbd badges.",
    memberIds: ["copy-button", "copyable-text", "keyboard-shortcut"],
  },
  {
    id: "status-indicators",
    name: "Status & Presence",
    category: "utility",
    description:
      "System state at a glance — presence dots, API/service status pills, environment and version badges.",
    memberIds: ["status-indicator", "api-status", "environment-badge", "version-badge"],
  },
  {
    id: "http-inspectors",
    name: "HTTP Inspectors",
    category: "utility",
    description:
      "Network debugging — request viewers, response viewers and syntax-highlighted code snippets.",
    memberIds: ["request-viewer", "response-viewer", "code-snippet", "syntax-highlighter"],
  },

  /* ----------------------------- Saptapadi ----------------------------- */
  {
    id: "matrimony-profiles",
    name: "Profiles",
    category: "saptapadi",
    description:
      "The matrimonial profile family — glass profile cards, the full dossier modal and the profile edit dialog with avatar upload.",
    memberIds: ["profile-card", "profile-detail-modal", "profile-edit-dialog"],
  },
  {
    id: "matrimony-engagement",
    name: "Engagement",
    category: "saptapadi",
    description:
      "Member-to-member and member-to-matchmaker touchpoints — interest sheet, AI concierge chat, auth modal and the notification bell.",
    memberIds: ["interests-sheet", "concierge-chat", "auth-modal", "notifications-bell"],
  },
  {
    id: "matrimony-search",
    name: "Search & Saves",
    category: "saptapadi",
    description:
      "Find and keep — the save-search dialog, the saved-searches panel and the member dashboard shell.",
    memberIds: ["save-search-dialog", "saved-searches-panel", "member-dashboard"],
  },
  {
    id: "matrimony-ops",
    name: "Matchmaker Desk",
    category: "saptapadi",
    description:
      "The back-office — gated matchmaker desk with queue, bulk decisions, catalogue curation and stats.",
    memberIds: ["matchmaker-desk"],
  },
  {
    id: "site-chrome",
    name: "Site Chrome",
    category: "saptapadi",
    description:
      "Site-level finishing touches — announcement bar, gold scroll progress bar and back-to-top button.",
    memberIds: ["announcement-bar", "scroll-progress-bar", "back-to-top"],
  },
];

/**
 * Docs whose demos render full app-like surfaces — their demo cards get the
 * Desktop / Tablet / Mobile stage toggle so the preview can be narrowed.
 */
export const RESPONSIVE_DOCS = new Set([
  "navbar",
  "sidebar",
  "data-table",
  "data-grid",
  "dashboard",
  "dashboard-grid",
  "kpi-grid",
  "kanban",
  "calendar-scheduler",
  "calendar-view",
  "file-manager",
  "command-palette",
  "member-dashboard",
  "matchmaker-desk",
  "checkout-form",
  "login-form",
  "signup-form",
  "auth-layout",
  "product-grid",
  "activity-feed",
  "data-toolbar",
  "query-builder",
  "rich-text-editor",
  "code-editor",
  "diff-viewer",
  "log-viewer",
  "terminal",
  "tree",
  "saved-searches-panel",
]);
