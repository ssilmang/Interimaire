import { Permanent, Profile } from "./permanent"

export interface Response<T> {
    statut:number
    message:string
    data:T
}
export interface DataInterim{
    interimaires:Interim[]
    pagination:pagination
}
export interface Interim{
    id:number
    etat:string
    profile:Profile
    contrats:Contrat
    categorie:Categorie
    poste:Poste
    statut:Role
    responsable:Permanent
    locau:Role
}
export interface Contrat{
    id:number
    date:string
    motif:string
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
    DA_kangourou:number
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
export interface pagination{
    page:number
    taille:number
    total:number
    derniere_page:number
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
    telephone_pro:string
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
    agence_commercials:DataService[]
}
export interface DataService{
    id:number
    libelle:string
    adresse:string

}
  
  export interface RequestRompre{
    date:string
    motif:String
  }
  export interface dataUser{
    username:string
    password:string
  }
  export interface RequestUser{
    nom:string
    prenom:string
    email:string
    matricule:string
    telephone:string
    role:string
    telephone_pro:string
    password:string

}
export interface UserToken{
    token:string
    user:User
}

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
    quantity: number;
  }

 export const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', quantity: 100},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', quantity: 100},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', quantity: 100},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', quantity: 100},
  ];

export interface DataRemplacer{
    id:number
    remplacer:DataInterim
    remplacant:DataInterim
}
export interface Task {
    name: string;
    completed: boolean;
    subtasks?: Task[];
  }

  export interface TaskPermanent {
    name: string;
    completed: boolean;
    permanents?: Permanent[];
  }
  export interface DataReporting{
    interimaire:Interimaire
    prestataire:permaentCount
    permanent:permaentCount
  }
  export interface Interimaire{
    en_cours:number
    rompre:number
    terminer:number
    // kangourou:number
  }
  export  interface permaentCount{
    en_cours:number
    terminer:number
  }
  export interface DataRang{
    dataCanal:any
    dataRang:any
  }
//  export const  codeCouleur: [
//         {
//           "colorcode": "green"
//         },
//         { 
//           "colorcode": "yellow"
//         },
//         { 
//           "colorcode": "red"
//         },
//         {
//           "colorcode": "blue"
//         },
//         {
//           "colorcode": "grey"
//         },
//         {
//           "colorcode": "orange"
//         },
//         {
//           "colorcode": "pink"
//         },
//         {
//           "colorcode": "pink"
//         }
//       ]
export var productSales = [
    {
      "name": "book",
      "value": 5001
    }, {
      "name": "graphic card",
      "value": 7322
    }, {
      "name": "desk",
      "value": 1726
    }, {
      "name": "laptop",
      "value": 2599
    }, {
      "name": "monitor",
      "value": 705
    }
  ];
  
  
  export var productSalesMulti = [
    {
      "name": "book",
      "series": [
        {
          "name": "January",
          "value": 125
        }, {
          "name": "February",
          "value": 197
        }, {
          "name": "March",
          "value": 209
        }
      ]
    }, {
      "name": "graphic card",
      "series": [
        {
          "name": "January",
          "value": 210
        }, {
          "name": "February",
          "value": 255
        }, {
          "name": "March",
          "value": 203
        }
      ]
    }, {
      "name": "desk",
      "series": [
        {
          "name": "January",
          "value": 89
        }, {
          "name": "February",
          "value": 105
        }, {
          "name": "March",
          "value": 66
        }
      ]
    }, {
      "name": "laptop",
      "series": [
        {
          "name": "January",
          "value": 178
        }, {
          "name": "February",
          "value": 165
        }, {
          "name": "March",
          "value": 144
        }
      ]
    }, {
      "name": "monitor",
      "series": [
        {
          "name": "January",
          "value": 144
        }, {
          "name": "February",
          "value": 250
        }, {
          "name": "March",
          "value": 133
        }
      ]
    }
  ]
  
  export const bubbleData = [
    {
      name: 'book',
      series: [
        {
          name: 'January',
          x: 'January',
          y: 80.3,
          r: 80.4
        },
        {
          name: 'February',
          x: 'February',
          y: 80.3,
          r: 78
        },
        {
          name: 'March',
          x: 'March',
          y: 75.4,
          r: 79
        }
      ]
    },
    {
      name: 'graphic card',
      series: [
        {
          name: 'January',
          x: 'January',
          y: 78.8,
          r: 144
        },
        {
          name: 'February',
          x: 'February',
          y: 76.9,
          r: 178
        },
        {
          name: 'March',
          x: 'March',
          y: 75.4,
          r: 155
        }
      ]
    },
    {
      name: 'desk',
      series: [
        {
          name: 'January',
          x: 'January',
          y: 81.4,
          r: 63
        },
        {
          name: 'February',
          x: 'February',
          y: 79.1,
          r: 59.4
        },
        {
          name: 'March',
          x: 'March',
          y: 77.2,
          r: 56.9
        }
      ]
    },
    {
      name: 'laptop',
      series: [
        {
          name: 'January',
          x: 'January',
          y: 80.2,
          r: 62.7
        },
        {
          name: 'February',
          x: 'February',
          y: 77.8,
          r: 58.9
        },
        {
          name: 'March',
          x: 'March',
          y: 75.7,
          r: 57.1
        }
      ]
    }
  ];
  interface ChartData {
    name: string;
    value: number;
    // Add other properties based on what you expect from ngx-charts
  }
