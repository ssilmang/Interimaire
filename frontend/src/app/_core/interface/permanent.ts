import { Agence, Departement, Direction, Pole, Poste, Service, User } from "./interim"

export interface ResponsePermanent{
    dvs:Permanent
}

export interface Permanent{
    id:number
    nom:string
    prenom:string
    matricule:string
    email:string
    telephone:string
    telephone_pro:string
    avatar:string
    contrat:string
    adresse:string
    commentaire:string
    status:boolean
    poste:Poste
    canal:Agence
    statut:Agence
    groupe:Agence
    agence:Agence
    categorie:Agence
    direction:Direction
    pole:Pole
    departement:Departement
    service:Service
    responsable:User
    collaborateurs:Permanent[]
}