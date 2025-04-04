exports.getHomeData = async (req, res) => {
    res.render('index', {
        title: 'Test',
    });
};