const MenuCard = ({ item, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white shadow rounded-md overflow-hidden">
      <img
        src={item.gambar}
        alt={item.nama}
        className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-contain p-4"
      />
      <div className="p-4">
        <h2 className="font-bold text-sm mb-1">{item.nama}</h2>
        <p className="text-sm text-gray-600 mb-1">
          Harga : Rp {item.harga.toLocaleString("id-ID")}
        </p>
        <p className="text-sm text-gray-600 mb-3">Kategori : {item.kategori}</p>
        <span
          className={`inline-block px-2 py-1 text-xs rounded text-white mb-3 ${
            item.status === "Aktif" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {item.status.toUpperCase()}
        </span>
        <div className="flex gap-2 text-sm">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Hapus
          </button>
          <button
            onClick={onToggleStatus}
            className={`flex-1 px-3 py-1 rounded text-white hover:opacity-90 ${
              item.status === "Aktif" ? "bg-yellow-500" : "bg-green-500"
            }`}
          >
            {item.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
