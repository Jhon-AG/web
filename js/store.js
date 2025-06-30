document.addEventListener('DOMContentLoaded', function () {
    const carrito = [];
    const carritoBody = document.getElementById('carrito-body');

    function renderCarrito() {
        carritoBody.innerHTML = '';
        carrito.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${item.imagen}" alt="${item.producto}" class="img-fluid" style="width: 50px; height: 50px;"></td>
                <td>${item.producto}</td>
                <td>S/ ${item.precio}</td>
                <td>
                    <input type="number" class="form-control cantidad" data-index="${index}" value="${item.cantidad}" min="1">
                </td>
                <td>S/ ${(item.precio * item.cantidad).toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-remove" data-index="${index}">Eliminar</button>
                </td>
            `;
            carritoBody.appendChild(row);
        });
    }

    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function () {
            const producto = this.dataset.product;
            const precio = parseFloat(this.dataset.price);
            const imagen = this.dataset.image;
            const item = carrito.find(item => item.producto === producto);
            if (item) {
                item.cantidad++;
            } else {
                carrito.push({ producto, precio, cantidad: 1, imagen });
            }
            renderCarrito();

            // ✅ Mostrar mensaje de producto añadido
            const alert = document.createElement('div');
            alert.className = 'alert alert-success text-center';
            alert.innerText = `✔️ ${producto} añadido al carrito`;
            document.querySelector('main').prepend(alert);
            setTimeout(() => alert.remove(), 2500);
        });
    });

    carritoBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-remove')) {
            const index = parseInt(event.target.dataset.index);
            carrito.splice(index, 1);
            renderCarrito();
        }
    });

    carritoBody.addEventListener('change', function (event) {
        if (event.target.classList.contains('cantidad')) {
            const index = parseInt(event.target.dataset.index);
            const cantidad = parseInt(event.target.value);
            carrito[index].cantidad = cantidad;
            renderCarrito();
        }
    });

    document.getElementById('comprar-btn').addEventListener('click', function () {
        $('#formModal').modal('show');
    });

    document.getElementById('payment-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;
        const pago = document.getElementById('pago').value;
        alert('Datos guardados adecuadamente');
        $('#formModal').modal('hide');
    });

    document.getElementById('boleta-btn').addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;
        const pago = document.getElementById('pago').value;

        doc.text('Boleta de Venta', 10, 10);
        doc.text(`Nombre: ${nombre}`, 10, 20);
        doc.text(`Teléfono: ${telefono}`, 10, 30);
        doc.text(`Dirección: ${direccion}`, 10, 40);
        doc.text(`Pago: ${pago}`, 10, 50);

        let y = 60;
        carrito.forEach((item, index) => {
            doc.text(`${item.producto}`, 10, y);
            doc.text(`S/ ${item.precio}`, 80, y);
            doc.text(`${item.cantidad}`, 110, y);
            doc.text(`S/ ${(item.precio * item.cantidad).toFixed(2)}`, 140, y);
            y += 10;
        });

        const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        doc.text(`Total: S/ ${total.toFixed(2)}`, 10, y + 10);

        doc.save('boleta.pdf');
        carrito.length = 0;
        renderCarrito();
    });
});
