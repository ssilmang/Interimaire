export enum AdminRoutes {
  Dashboard = 'dashboard',
  Events = 'events',
  Permanent = 'permanent',
  Prestataire = 'prestataire',
  Settings = 'settings',
  Elements = 'elements',
}

export enum ElementRoutes {
  Alert = 'alert',
  Modal = 'modal',
  Buttons = 'buttons',
  Tabs = 'tabs',
  DataTable = 'data-table/:id',
  Forms = 'forms',
  DataPrestataire='data-prestataire',
  Import = 'import-excel',
}
export enum ElementData{
  DataTable = 'data-table/1',
}

export enum SettingRoutes {
  Profile = 'profile',
  Users = 'users',
}
