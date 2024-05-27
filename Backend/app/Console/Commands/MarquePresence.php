<?php

namespace App\Console\Commands;

use App\Mail\AlertKangourou;
use App\Models\Contrat;
use App\Models\Interim;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class MarquePresence extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:marque-presence';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Marque la presence de tous les interimaires';

    /**
     * Execute the console command.
     */
    public function handle()
    {
       $contrats = Contrat::all();
       foreach ($contrats as $key => $value) {
        if( $value['etat']!=1)
        {         
            $value->increment("temps_presence_structure_actuel");
            $contrat_terminer = $value['duree_contrat']*30 -  $value['temps_presence_structure_actuel'];
            if($contrat_terminer ===0)
            {
                $value->update(['etat'=>1]);
            }
            $temps_presence =  ($value['temps_presence_structure_actuel'] % 30);
            $this->info($value['temps_presence_structure_actuel']);
            if($temps_presence === 0)
            {
                $value->decrement('duree_contrat_restant');
                $cumul_presence  = $value['temps_presence_autre_structure_sonatel'] + ($value['temps_presence_structure_actuel'] / 30);
                 $value->update(['cumul_presence_sonatel'=>$cumul_presence]);
            }
            $alert = ($value['duree_contrat']*30) - $value['temps_presence_structure_actuel'] ;
            if($value['interim_id']){
                if($alert === 60 || $alert === 45)
                {
                    $interim = Interim::where(['id'=>$value['interim_id']])->first();
                   Mail::to('silmangsarr1998@gmail.com')->send(new AlertKangourou($interim,$value));
                }
            }
        }
       }
       
    }
}
