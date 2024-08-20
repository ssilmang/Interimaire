export enum AdminRoutes {
  Interimaire = 'interimaire',
  Events = 'events',
  Permanent = 'permanent',
  Prestataire = 'prestataire',
  Settings = 'settings',
  Elements = 'elements',
  Dashboard='dashboard'
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
  Dashboard= 'dashboard',
  DataRemplacer = "data-remplacer"
}
export enum ElementData{
  DataTable = 'data-table/1',
}

export enum SettingRoutes {
  Profile = 'profile',
  Users = 'users',
}
