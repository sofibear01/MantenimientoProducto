using System;
using System.Collections.Generic;

namespace MantenimientoProductos.Server.Models;

public partial class Product
{
    public string ProductId { get; set; } = null!;

    public int CategoryProductId { get; set; }

    public string ProductDescription { get; set; } = null!;

    public int Stock { get; set; }

    public decimal Price { get; set; }

    public string HaveEcDiscount { get; set; } = null!;

    public string IsActive { get; set; } = null!;

    public virtual ProductCategory CategoryProduct { get; set; } = null!;
}
