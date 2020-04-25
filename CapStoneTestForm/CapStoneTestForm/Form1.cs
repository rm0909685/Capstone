#region Using
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using System.IO;
using System.IO.Compression;
using Org.BouncyCastle.Bcpg.OpenPgp;
using System.Reflection;
#endregion End Using

namespace CapStoneTestForm{
    public partial class Form1 : Form{
        string strFolder = string.Empty;
        public Form1(){
            InitializeComponent();
            tv.CheckBoxes = true; //Puts check boxes onto treeview
            //tv.ExpandAll();

        }

        private void btnFolderBrowserDialog_Click(object sender, EventArgs e){
            #region OpenFileDialog
            OpenFileDialog ofdPrompt = new OpenFileDialog();
            ofdPrompt.InitialDirectory = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory) + @"\CSTestRoot\CSTest";
            ofdPrompt.Filter = "PGP files|*.pgp";

            try {
                if (ofdPrompt.ShowDialog() == DialogResult.OK){
                    strFolder = ofdPrompt.FileName;
                    Unencrypt(strFolder);
                    ZipFile.ExtractToDirectory(strFolder.Substring(0, strFolder.Length - 4), strFolder.Substring(0, strFolder.Length - 8));

                    tv.Nodes.Clear();
                    foreach (TreeNode tn in Traverse(new DirectoryInfo(strFolder.Substring(0, strFolder.Length - 8))).Nodes){
                        tv.Nodes.Add(tn);
                    }

                    ///https://www.youtube.com/watch?v=B8KUknLT6qU
                    TreeNode Traverse(DirectoryInfo di){
                        TreeNode DirectoryNode = new TreeNode(di.Name);
                        foreach (var d in di.GetDirectories()){
                            DirectoryNode.Nodes.Add(Traverse(d)); //calls recursion for files
                        }
                        foreach (var file in di.GetFiles()){
                            //If we want to do something special with file types, this is where to do it
                            DirectoryNode.Nodes.Add(new TreeNode(file.Name));
                        }
                        return DirectoryNode;
                    }
                }
            } catch (Exception ex) { MessageBox.Show(ex.ToString()); }
            #endregion End OpenFileDialog


            /*
                ///FOLDER BROWSER POPULATES TREEVIEW
                FolderBrowserDialog fbd = new FolderBrowserDialog();
                fbd.ShowNewFolderButton = false;
                fbd.SelectedPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory) + @"\CSTestRoot\CSTest";
                if (fbd.ShowDialog() == DialogResult.OK){
                    string MyPath = fbd.SelectedPath; //Current Folder, send to cookie as folder on startup
                    Environment.SpecialFolder fbdRoot = fbd.RootFolder; //New Starting Point for Folder, send to cookie as default fbd directory
                    tv.Nodes.Clear();
                    foreach (TreeNode tn in Traverse(new DirectoryInfo(MyPath)).Nodes){
                        tv.Nodes.Add(tn);
                    }

                    ///https://www.youtube.com/watch?v=B8KUknLT6qU
                    TreeNode Traverse(DirectoryInfo di){
                        TreeNode DirectoryNode = new TreeNode(di.Name);
                        foreach (var d in di.GetDirectories()){
                            DirectoryNode.Nodes.Add(Traverse(d)); //calls recursion for files
                        }
                        foreach (var file in di.GetFiles()){
                            //If we want to do something special with file types, this is where to do it
                            DirectoryNode.Nodes.Add(new TreeNode(file.Name));
                        }
                        return DirectoryNode;
                    }

                    ///Extra UI Features
                    linkPath.Text = MyPath;
                }
            */
        }


        private void Unencrypt(string EncryptedFile){
            PgpHelper.DecryptFile(EncryptedFile, GetSecretKeyRingBundle(), "7CvhR4hGsLWNpZ3JQ4qwYH182wAPTnxBJGtfT+CfXzw=");
            PgpSecretKeyRingBundle GetSecretKeyRingBundle(){
                using (Stream s = Assembly.GetExecutingAssembly().GetManifestResourceStream("CapStoneTestForm.secring.skr")){
                    return new PgpSecretKeyRingBundle(PgpUtilities.GetDecoderStream(s));
                }
            }
        }
    }

    //Encrpytion assets provided by JHA
    #region pgpFileDecryptingStream
    /// <summary>
    /// A stream that decrypts a PGP encrypted literal file stream.
    /// </summary>
    /// <seealso cref="System.IO.Stream" />
    public sealed class PgpFileDecryptingStream : Stream
    {
        private Stream wrappedStream;

        /// <summary>
        /// Initializes a new instance of the <see cref="PgpFileDecryptingStream"/> class.
        /// </summary>
        /// <param name="inputStream">The encrypted input stream.</param>
        /// <param name="secretKeyRingBundle">The secret key ring bundle.</param>
        /// <param name="passPhrase">The pass phrase.</param>
        /// <exception cref="System.ArgumentException">Secret key for message not found.</exception>
        /// <exception cref="PgpException">
        /// Encrypted message contains a signed message - not literal data.
        /// or
        /// Message is not a simple encrypted file - type unknown.
        /// </exception>
        public PgpFileDecryptingStream(
            Stream inputStream,
            PgpSecretKeyRingBundle secretKeyRingBundle,
            string passPhrase)
        {
            inputStream = PgpUtilities.GetDecoderStream(inputStream);

            PgpObjectFactory encryptedObjectFactory = new PgpObjectFactory(inputStream);

            // the first object might be a PGP marker packet.
            PgpEncryptedDataList encryptedList = encryptedObjectFactory.NextPgpObject() as PgpEncryptedDataList;
            if (encryptedList == null)
            {
                encryptedList = (PgpEncryptedDataList)encryptedObjectFactory.NextPgpObject();
            }

            // decrypt
            PgpPrivateKey privateKey = null;
            PgpPublicKeyEncryptedData encryptedData = null;
            foreach (PgpPublicKeyEncryptedData pked in encryptedList.GetEncryptedDataObjects())
            {
                privateKey = PgpHelper.FindSecretKey(secretKeyRingBundle, pked.KeyId, passPhrase.ToCharArray());

                if (privateKey != null)
                {
                    encryptedData = pked;
                    break;
                }
            }

            if (privateKey == null)
            {
                throw new ArgumentException("Secret key for message not found.");
            }

            PgpObjectFactory decryptedObjectFactory = null;
            using (Stream decryptedStream = encryptedData.GetDataStream(privateKey))
            {
                decryptedObjectFactory = new PgpObjectFactory(decryptedStream);
            }

            PgpObject message = decryptedObjectFactory.NextPgpObject();
            if (message is PgpCompressedData)
            {
                PgpCompressedData compressedData = (PgpCompressedData)message;

                PgpObjectFactory decompressedObjectFactory = null;
                using (Stream decompressedStream = compressedData.GetDataStream())
                {
                    decompressedObjectFactory = new PgpObjectFactory(decompressedStream);
                }

                message = decompressedObjectFactory.NextPgpObject();
                if (message is PgpOnePassSignatureList)
                {
                    message = decompressedObjectFactory.NextPgpObject();
                }
            }

            if (message is PgpOnePassSignatureList)
            {
                throw new PgpException("Encrypted message contains a signed message - not literal data.");
            }
            else if (!(message is PgpLiteralData))
            {
                throw new PgpException("Message is not a simple encrypted file - type unknown.");
            }

            PgpLiteralData ld = (PgpLiteralData)message;
            this.WrappedFileName = ld.FileName;
            this.WrappedFileModifiedTime = ld.ModificationTime;
            this.wrappedStream = ld.GetInputStream();
        }

        /// <summary>
        /// Gets the name of the wrapped file.
        /// </summary>
        /// <value>
        /// The name of the wrapped file.
        /// </value>
        public string WrappedFileName { get; private set; }

        /// <summary>
        /// Gets the wrapped file modified time.
        /// </summary>
        /// <value>
        /// The wrapped file modified time.
        /// </value>
        public DateTime WrappedFileModifiedTime { get; private set; }

        /// <summary>
        /// When overridden in a derived class, gets a value indicating whether the current stream supports reading.
        /// </summary>
        public override bool CanRead => this.wrappedStream.CanRead;

        /// <summary>
        /// When overridden in a derived class, gets a value indicating whether the current stream supports seeking.
        /// </summary>
        public override bool CanSeek => this.wrappedStream.CanSeek;

        /// <summary>
        /// When overridden in a derived class, gets a value indicating whether the current stream supports writing.
        /// </summary>
        public override bool CanWrite => this.wrappedStream.CanWrite;

        /// <summary>
        /// When overridden in a derived class, gets the length in bytes of the stream.
        /// </summary>
        public override long Length => this.wrappedStream.Length;

        /// <summary>
        /// When overridden in a derived class, gets or sets the position within the current stream.
        /// </summary>
        public override long Position
        {
            get
            {
                return this.wrappedStream.Position;
            }

            set
            {
                this.wrappedStream.Position = value;
            }
        }

        /// <summary>
        /// When overridden in a derived class, clears all buffers for this stream and causes any buffered data to be written to the underlying device.
        /// </summary>
        public override void Flush() =>
            this.wrappedStream.Flush();

        /// <summary>
        /// When overridden in a derived class, reads a sequence of bytes from the current stream and advances the position within the stream by the number of bytes read.
        /// </summary>
        /// <param name="buffer">An array of bytes. When this method returns, the buffer contains the specified byte array with the values between <paramref name="offset" /> and (<paramref name="offset" /> + <paramref name="count" /> - 1) replaced by the bytes read from the current source.</param>
        /// <param name="offset">The zero-based byte offset in <paramref name="buffer" /> at which to begin storing the data read from the current stream.</param>
        /// <param name="count">The maximum number of bytes to be read from the current stream.</param>
        /// <returns>
        /// The total number of bytes read into the buffer. This can be less than the number of bytes requested if that many bytes are not currently available, or zero (0) if the end of the stream has been reached.
        /// </returns>
        public override int Read(byte[] buffer, int offset, int count) =>
            this.wrappedStream.Read(buffer, offset, count);

        /// <summary>
        /// When overridden in a derived class, sets the position within the current stream.
        /// </summary>
        /// <param name="offset">A byte offset relative to the <paramref name="origin" /> parameter.</param>
        /// <param name="origin">A value of type <see cref="T:System.IO.SeekOrigin" /> indicating the reference point used to obtain the new position.</param>
        /// <returns>
        /// The new position within the current stream.
        /// </returns>
        public override long Seek(long offset, SeekOrigin origin) =>
            this.wrappedStream.Seek(offset, origin);

        /// <summary>
        /// When overridden in a derived class, sets the length of the current stream.
        /// </summary>
        /// <param name="value">The desired length of the current stream in bytes.</param>
        public override void SetLength(long value) =>
            this.wrappedStream.SetLength(value);

        /// <summary>
        /// When overridden in a derived class, writes a sequence of bytes to the current stream and advances the current position within this stream by the number of bytes written.
        /// </summary>
        /// <param name="buffer">An array of bytes. This method copies <paramref name="count" /> bytes from <paramref name="buffer" /> to the current stream.</param>
        /// <param name="offset">The zero-based byte offset in <paramref name="buffer" /> at which to begin copying bytes to the current stream.</param>
        /// <param name="count">The number of bytes to be written to the current stream.</param>
        public override void Write(byte[] buffer, int offset, int count) =>
            this.wrappedStream.Write(buffer, offset, count);

        /// <summary>
        /// Releases the unmanaged resources used by the <see cref="T:System.IO.Stream" /> and optionally releases the managed resources.
        /// </summary>
        /// <param name="disposing">true to release both managed and unmanaged resources; false to release only unmanaged resources.</param>
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            if (disposing)
            {
                this.wrappedStream.Dispose();
                this.wrappedStream = null;
            }
        }
    }
    #endregion End phpFileEncryptingStream
    #region pgpHelper
    /// <summary>
    /// A collection of PGP file utilities.
    /// </summary>
    public static class PgpHelper
    {
        /// <summary>
        /// Gets the current UID public encryption key.
        /// </summary>
        /// <value>
        /// The public key.
        /// </value>
        public static PgpPublicKey PublicKey
        {
            get
            {
                using (Stream publicKeyStream = Assembly.GetExecutingAssembly().GetManifestResourceStream("PgpLib.pubring.pkr"))
                {
                    return ReadPublicEncryptionKeys(publicKeyStream).First();
                }
            }
        }

        /// <summary>
        /// Decrypts a PGP encrypted file.
        /// </summary>
        /// <param name="inputFilePath">The encrypted input file path.</param>
        /// <param name="privateKeyRingBundle">The private key ring bundle.</param>
        /// <param name="passPhrase">The pass phrase.</param>
        /// <param name="outputDirectory">The output directory. Defaults to the directory of the input file.</param>
        /// <param name="outputFileName">The output file name. Defaults to the file name embedded in the PGP file.</param>
        /// <returns>The path to the decrypted file.</returns>
        public static string DecryptFile(
            string inputFilePath,
            PgpSecretKeyRingBundle privateKeyRingBundle,
            string passPhrase,
            string outputDirectory = null,
            string outputFileName = null)
        {
            if (outputDirectory == null)
            {
                outputDirectory = Path.GetDirectoryName(inputFilePath);
            }

            string outputPath;
            using (Stream inputStream = File.OpenRead(inputFilePath))
            using (PgpFileDecryptingStream pgpStream = new PgpFileDecryptingStream(inputStream, privateKeyRingBundle, passPhrase))
            {
                outputPath = Path.Combine(outputDirectory, outputFileName ?? pgpStream.WrappedFileName);

                using (Stream outputStream = File.Create(outputPath))
                {
                    pgpStream.CopyTo(outputStream);
                }

                FileInfo fileInfo = new FileInfo(outputPath);
                fileInfo.LastWriteTime = pgpStream.WrappedFileModifiedTime;
                fileInfo.CreationTime = pgpStream.WrappedFileModifiedTime;
            }

            return outputPath;
        }

        /// <summary>
        /// Reads the public encryption keys from the input stream.
        /// </summary>
        /// <param name="inputStream">The input stream.</param>
        /// <returns>The PGP public encryption keys.</returns>
        public static IEnumerable<PgpPublicKey> ReadPublicEncryptionKeys(Stream inputStream)
        {
            inputStream = PgpUtilities.GetDecoderStream(inputStream);

            PgpPublicKeyRingBundle pkrb = new PgpPublicKeyRingBundle(inputStream);

            foreach (PgpPublicKeyRing pkr in pkrb.GetKeyRings())
            {
                foreach (PgpPublicKey pk in pkr.GetPublicKeys())
                {
                    if (pk.IsEncryptionKey)
                    {
                        yield return pk;
                    }
                }
            }
        }

        /// <summary>
        /// Finds the secret key.
        /// </summary>
        /// <param name="pgpSecretKeyRingBundle">The PGP secret key ring bundle.</param>
        /// <param name="keyId">The key identifier.</param>
        /// <param name="passPhrase">The pass phrase.</param>
        /// <returns>The PGP private key.</returns>
        public static PgpPrivateKey FindSecretKey(PgpSecretKeyRingBundle pgpSecretKeyRingBundle, long keyId, char[] passPhrase)
        {
            PgpSecretKey pgpSecKey = pgpSecretKeyRingBundle.GetSecretKey(keyId);

            if (pgpSecKey == null)
            {
                return null;
            }

            return pgpSecKey.ExtractPrivateKey(passPhrase);
        }
    }
    #endregion End pgpHelper
}
