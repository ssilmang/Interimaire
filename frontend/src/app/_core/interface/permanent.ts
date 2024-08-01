import { Agence, DataDirection, Departement, Direction, Locau, pagination, Pole, Poste, Role, Service, User } from "./interim"

export interface ResponsePermanent{
    dvs:Permanent
}
export interface DataPermanent{
    permanent:Permanent
    collaborateurs:Permanent[]
    pagination:pagination
}

export interface Permanent{
    id:number
    profile:Profile
    status:boolean
    poste:Poste
    canal:Role
    statut:Role
    groupe:Role
    agence:Agence
    categorie:Role
    direction:Direction
    pole:Pole
    locau:Locau
    departement:Departement
    service:Service
    responsable:Responsable
    // collaborateurs:Permanent[]
}
export interface Responsable{
    id:number
    profile:Profile
}
export interface Profile{
    id:number
    nom:string
    prenom:string
    matricule:string
    email:string
    telephone:string
    telephone_pro:string
    photo:string
    contrat:string
    adresse:string
    commentaire:string
}
export interface DataALL{
    canals:Role[]
    statuts:Role[]
    postes:Poste[]
    groupes:Role[]
    categories:Role[]
    agences:Agence[]
    directions:DataDirection[]
    responsable:Responsable[]
    locaux:Locau[]
}
export interface RequestPermanent{
    prenom:string
    nom:string
    email:string
    matricule:string
    contrat:string
    telephone:string
    telephone_pro:string
    adresse:string
    photo:string
    poste_id:number|string
    statut_id:number|string
    groupe_id:number|string
    categorie_id:number|string
    agence_id:number|string
    locau_id:number|string
    canal_id:number|string
    direction_id:number|string
    pole_id:number|string
    departement_id:number|string
    service_id:number|string
    responsable_id:number|string

}
export interface DataPrestataire{
    prestataires:Permanent[]
    pagination:pagination
}