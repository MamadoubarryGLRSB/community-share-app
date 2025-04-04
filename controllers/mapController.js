exports.showMap = async (req, res) => {
    const address = "Quai Stéphane Jay, 38000 Grenoble";
    const name = "La bastille"

    // Get coordinate from address
    const url = encodeURI(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`);
    const responseGet = await fetch(url, {
        method: 'GET',
    });

    if (!responseGet.ok) {
        throw new Error(`GET API Error: ${responseGet.statusText}`);
    }
    const responseGetData = await responseGet.json();
    const coordinate = {
        latitude: responseGetData[0].lat,
        longitude: responseGetData[0].lon,
        name: name
    }

    res.render('map', {
        title: 'Map viewer',
        leafletJs: '/js/leaflet.js',
        coordinate: coordinate
    });
};
