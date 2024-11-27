using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MantenimientoProductos.Server.Models;

public partial class ProductCategory
{
    public int CategoryProductId { get; set; }

    public string CategoryDescription { get; set; } = null!;

    public string IsActive { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
