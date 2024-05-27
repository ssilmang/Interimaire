<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Images</title>
   
</head>
<body>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Images</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @foreach($images as $image)
                <div class="m-4">
                    <img class="w-full object-cover" src="{{ asset('/uploads/higlights/' . $image->photo) }}" alt="Profile">
                </div>
            @endforeach
        </div>
    </div>
    
</body>
</html>
