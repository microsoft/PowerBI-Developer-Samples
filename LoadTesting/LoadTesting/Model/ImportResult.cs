using System.Collections.Generic;

namespace LoadTesting.Model
{
    public class ImportResult
    {
        public string Id { get; set; }
        public string ImportState { get; set; }
        public IEnumerable<ImportDataset> Datasets { get; set; }
        public IEnumerable<ImportReport> Reports { get; set; }
    }
}