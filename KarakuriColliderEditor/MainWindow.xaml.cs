using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace KarakuriColliderEditor
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private readonly SpriteAnimation _spriteAnimation = new();

        public MainWindow()
        {
            InitializeComponent();
            RenderOptions.SetBitmapScalingMode(frameDisplay, BitmapScalingMode.NearestNeighbor);
        }

        private void New_Click(object sender, RoutedEventArgs e) 
        {
            _spriteAnimation.OpenFile();
            frameDisplay.Source = _spriteAnimation.Frames[0];
        }
    }
}