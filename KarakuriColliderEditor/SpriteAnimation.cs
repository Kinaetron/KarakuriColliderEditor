using AsepriteDotNet.IO;
using AsepriteDotNet.Aseprite;
using Microsoft.Win32;
using AsepriteDotNet.Common;
using AsepriteDotNet.Aseprite.Types;
using System.Windows.Media.Imaging;
using System.Windows.Media;
using System.IO;
using System.ComponentModel.DataAnnotations;
using System.Windows;

namespace KarakuriColliderEditor
{
    class SpriteAnimation
    {
        public int FrameCount { get; private set; }
        public List<BitmapSource> Frames { get; private set; } = new();
        private readonly OpenFileDialog _openDialog = new();

        public SpriteAnimation()
        {
            _openDialog.DefaultExt = ".ase";
            _openDialog.Filter = "Aseprite Files (*ase)|*.ase;*.aseprite";
        }

        public void OpenFile()
        {
            if(_openDialog.ShowDialog() == true) 
            {
                Frames.Clear();
                var asepriteFile = AsepriteFileLoader.FromFile(_openDialog.FileName);
                FrameCount = asepriteFile.FrameCount;
                foreach (var frame in asepriteFile.Frames)
                {
                    var framePixels = frame.FlattenFrame(onlyVisibleLayers: true, includeBackgroundLayer: false, includeTilemapCels: false);
                    using var memoryStream = new MemoryStream();
                    for (int i = 0; i < framePixels.Length; i++)
                    {
                        memoryStream.WriteByte(framePixels[i].B);
                        memoryStream.WriteByte(framePixels[i].G);
                        memoryStream.WriteByte(framePixels[i].R);
                        memoryStream.WriteByte(framePixels[i].A);
                    }

                    var writableBitMap = new WriteableBitmap(
                        frame.Size.Width,
                        frame.Size.Height,
                        96,
                        96,
                        PixelFormats.Bgra32,
                        null);

                    writableBitMap.WritePixels(
                        new Int32Rect(0, 0, frame.Size.Width, frame.Size.Height),
                        memoryStream.ToArray(),
                        frame.Size.Width * 4,
                        0);

                    Frames.Add(writableBitMap);
                }
            }
        }
    }
}
