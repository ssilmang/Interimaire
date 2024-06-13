import { Permanent, Profile } from "./permanent"

export interface Response<T> {
    statut:number
    message:string
    data:T
}
export interface DataInterim{
    interimaires:Interim[]
}
export interface Interim{
    id:number
   profile:Profile
    contrats:Contrat[]
    categorie:Categorie
    poste:Poste
    responsable:Permanent
}
export interface Contrat{
    id:number
    date_debut_contrat:string
    date_fin_contrat:string
    temps_presence_structure_actuel:number
    temps_presence_autre_structure_sonatel:number
    cumul_presence_sonatel:number
    duree_contrat:number
    duree_contrat_restant:number
    cout_mensuel:number
    cout_global:number
    DA:number
    DA_kangurou:number
    etat:number
    commentaire:number
    interim:number
}
export interface Categorie{
    id:number
    libelle:string
    cout_unitaire_journalier:number
    agence:Role
}
export interface Agence{
    id:number
    libelle:string
    categories:Categorie[]
}
export interface Poste{
    id:number
    libelle:string
    duree_kangurou:number
    montant_kangurou:number
}
export interface Responsable{
    id:number
    user:User
    service:Service

}
export interface Service{
    id:number
    libelle:string
    departement:Departement
}
export interface Departement{
    id:number
    libelle:string
    pole:Pole
}
export interface Pole{
    id:number
    libelle:string
    direction:Direction
}
export interface Direction{
    id:number
    libelle:string
    locau:Locau
}
export interface Locau{
    id:number
    libelle:string
    adresse:string
    code:string
}
export interface User{
    id:number
    nom:string
    prenom:string
    email:string
    matricule:string
    telephone:string
    role:Agence
}
export interface Role{
    id:number
    libelle:string
}

export interface DataDirection{
    id:number
    libelle:string
    poles:DataPole[]
}
export interface DataPole{
    id:number
    libelle:string
    departements:DataDepartement[]
}
export interface DataDepartement{
    id:number
    libelle:string
    services:DataService[]
}
export interface DataService{
    id:number
    libelle:string
    adresse:string

}