<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h3>Bonjour, </h3>
    <p>Vous pouvez lancer le processus de Kangourou de {{ $interim['profile']['prenom']}} {{ $interim['profile']['nom']}}</p>
    qui occupe le poste de {{ $interim['poste']['libelle'] }}, son contrat prendra fin le {{ $contrat['date_fin_contrat'] }}
</body>
</html>