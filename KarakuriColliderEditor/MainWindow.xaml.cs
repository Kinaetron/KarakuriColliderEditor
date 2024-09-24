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
        private int _maxFrame = 0;
        private int _currentFrame = 0;
        private readonly Dictionary<Key, bool> _keyStates = [];
        private readonly SpriteAnimation _spriteAnimation = new();

        public MainWindow()
        {
            InitializeComponent();
            RenderOptions.SetBitmapScalingMode(frameDisplay, BitmapScalingMode.NearestNeighbor);

            _keyStates[Key.Left] = false;
            _keyStates[Key.Right] = false;
        }

        private void New_Click(object sender, RoutedEventArgs e) 
        {
            _spriteAnimation.OpenFile();
            _maxFrame = _spriteAnimation.FrameCount - 1;
            frameDisplay.Source = _spriteAnimation.Frames[_currentFrame];
        }

        private void Window_PreviewKeyUp(object sender, KeyEventArgs e)
        {
            var keyIsThere = _keyStates.TryGetValue(e.Key, out bool isPressed);
            if(keyIsThere && isPressed) {
                _keyStates[e.Key] = false;
            }
        }

        private void Window_PreviewKeyDown(object sender, KeyEventArgs e)
        {
            if(_spriteAnimation.FrameCount == 0) {
                return;
            }

            var keyIsThere = _keyStates.TryGetValue(e.Key, out bool isPressed);
            if(keyIsThere && !isPressed) 
            {
                switch (e.Key)
                {
                    case Key.Left:
                        _currentFrame = _currentFrame <= 0 ? 0 : _currentFrame - 1;
                        break;
                    case Key.Right:
                        _currentFrame = _currentFrame >= _maxFrame ? _maxFrame : _currentFrame + 1;
                        break;
                    default:
                        break;
                }

                _keyStates[e.Key] = true;
                frameDisplay.Source = _spriteAnimation.Frames[_currentFrame];
            }
        }

        private void LeftButton_Click(object sender, RoutedEventArgs e)
        {
            if (_spriteAnimation.FrameCount == 0) {
                return;
            }

            _currentFrame = _currentFrame <= 0 ? 0 : _currentFrame - 1;
            frameDisplay.Source = _spriteAnimation.Frames[_currentFrame];
        }

        private void RightButton_Click(object sender, RoutedEventArgs e)
        {
            if (_spriteAnimation.FrameCount == 0) {
                return;
            }

            _currentFrame = _currentFrame >= _maxFrame ? _maxFrame : _currentFrame + 1;
            frameDisplay.Source = _spriteAnimation.Frames[_currentFrame];
        }
    }
}