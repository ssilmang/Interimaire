<?php

namespace App\Console\Commands;

use App\Http\Resources\InterimResource;
use App\Mail\AlertKangourou;
use App\Models\Contrat;
use App\Models\Interim;
use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
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
        $interims = Interim::all();
       foreach ($interims as $key => $value)
       {
            $contrat = Contrat::where(['interim_id'=>$value['id'],'etat'=>0])->orderBy('date_debut_contrat','desc')->first();
            $this->info($contrat);
            if( $contrat && $contrat->etat === 0)
            {         
                $contrat->increment("temps_presence_structure_actuel");
                $contrat_terminer = $contrat->duree_contrat*30 -  $contrat->temps_presence_structure_actuel;
                if($contrat_terminer === 0)
                {
                    $contrat->update(['etat'=>-1]);
                    Interim::find($value['id'])->update(['etat'=>"terminer"]);
                }
                $temps_presence =  ($contrat->temps_presence_structure_actuel % 30);
                $this->info($contrat->temps_presence_structure_actuel);
                if($temps_presence === 0)
                {
                    $contrat->decrement('duree_contrat_restant');
                    $cumul_presence  = $contrat->temps_presence_autre_structure_sonatel + ($contrat->temps_presence_structure_actuel / 30);
                     $contrat->update(['cumul_presence_sonatel'=>$cumul_presence]);
                }
                $alert = ($contrat->duree_contrat*30) - $contrat->temps_presence_structure_actuel;
                if($contrat->interim_id)
                {
                    if($alert === 60 || $alert === 45)
                    {
                        $role = Role::where('libelle','Admin')->first();
                        $users = User::where('role_id',$role->id)->get();
                        foreach ($users as $ke => $user)
                        {
                            $interimaire = new InterimResource($value);
                            Mail::to($user['email'])->send(new AlertKangourou($interimaire,$contrat));
                        }
                    }
                }
            }
       }
       
    }
}
