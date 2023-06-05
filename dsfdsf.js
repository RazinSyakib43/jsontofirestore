router.get("/:id/:tanggal", async (req, res) => {
  try {
    const idCari = req.params.id;
    const tanggalCari = req.params.tanggal;

    const response = await db
      .collection("historyActivity")
      .doc(req.params.id)
      .get();

    const data = response.data();

    if (!data) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: `Data History Activity dengan id ${idCari} tidak ditemukan`,
      });
    }

    const historyArr = Object.values(data);
    const foundHistory = historyArr.find(
      (history) => history.tanggal === tanggalCari
    );

    if (!foundHistory) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: `Data History Activity dengan id ${idCari} dan tanggal ${tanggalCari} tidak ditemukan`,
      });
    }

    const historyActivity = {
      id_user: idCari,
      History: [
        {
          tanggal: foundHistory.tanggal,
          kalori_harian: foundHistory.kalori_harian,
          total_kalori: foundHistory.total_kalori,
          sisa_kalori: foundHistory.sisa_kalori,
          aktifitas: {
            kalori_masuk: foundHistory.aktifitas.kalori_masuk,
          },
        },
      ],
    };

    res.status(200).json({
      code: 200,
      error: false,
      message: `Data History Activity dengan id ${idCari} dan tanggal ${tanggalCari} ditemukan`,
      listHistoryActivity: historyActivity,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
      error: true,
      message: error.message,
    });
  }
});
