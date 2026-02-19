# 💝 365 Days of Loving You - Anniversary App

A beautiful, romantic Next.js web application to celebrate your one-year anniversary. Features include a photo slideshow background, music player, timeline, photo gallery with upload, love letters, and customizable color themes.

## ✨ Features

- **🖼️ Photo Slideshow Background**: Automatically rotating photos with smooth transitions and Ken Burns effect
- **🎵 Music Player**: Integrated music queue with controls (Spotify integration ready)
- **📅 Timeline**: Beautiful timeline showcasing your relationship milestones
- **📸 Photo Gallery**: Upload and view your favorite memories together
- **💌 Love Letters**: Write and read heartfelt messages
- **🎨 Customizable Themes**: 6 color presets + custom color picker
- **✨ Smooth Animations**: Framer Motion powered transitions
- **📱 Fully Responsive**: Works beautifully on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization Guide

### 1. Update Personal Information

Edit `/components/Navigation.tsx`:
```typescript
<span className="font-display text-white text-2xl font-bold">Your Initials</span>
```

Edit `/components/HomeSection.tsx` to customize:
- The main headline
- Anniversary message
- Statistics (days together, etc.)

### 2. Add Your Photos

**For Background Slideshow:**
Edit `/app/page.tsx`:
```typescript
const [photos, setPhotos] = useState<string[]>([
  '/photos/photo1.jpg',
  '/photos/photo2.jpg',
  '/photos/photo3.jpg',
])
```

Place your photos in the `public/photos/` directory.

**Via Upload Feature:**
Use the "Upload Photos" button in the Photo Gallery tab to add photos dynamically.

### 3. Customize Timeline Events

Edit `/components/TimelineSection.tsx`:
```typescript
const events: TimelineEvent[] = [
  {
    date: 'Your Date',
    title: 'Your Milestone',
    description: 'Your story...',
    location: 'Your Location',
  },
  // Add more events...
]
```

### 4. Add Love Letters

Edit `/components/LettersSection.tsx`:
```typescript
const [letters, setLetters] = useState<Letter[]>([
  {
    id: '1',
    from: 'Letter Title',
    date: 'Date',
    preview: 'Preview text...',
    content: `Full letter content...`,
    isLocked: false,
  },
])
```

### 5. Update Music Queue

Edit `/components/MusicPlayer.tsx`:
```typescript
const [queue, setQueue] = useState<Song[]>([
  { id: '1', title: 'Song Title', artist: 'Artist Name' },
  // Add your songs...
])
```

### 6. Change Color Theme

Click the "Our Year" button in the top right, then:
- Choose from 6 preset themes
- Use custom sliders to create your own palette

## 🎵 Spotify Integration (Advanced)

To integrate actual Spotify playback:

1. Create a Spotify Developer account
2. Register your application
3. Get your Client ID and Client Secret
4. Install Spotify Web API library:
   ```bash
   npm install spotify-web-api-node
   ```
5. Update `MusicPlayer.tsx` with Spotify API calls

## 📱 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Key Components

- **`SlideshowBackground.tsx`**: Handles photo rotation and overlay
- **`MusicPlayer.tsx`**: Music controls and queue management
- **`Navigation.tsx`**: Main navigation between sections
- **`SettingsModal.tsx`**: Theme customization interface
- **`HomeSection.tsx`**: Landing page with hero content
- **`TimelineSection.tsx`**: Relationship timeline
- **`GallerySection.tsx`**: Photo grid with upload and lightbox
- **`LettersSection.tsx`**: Love letters with lock/unlock feature

## 🎨 Design Philosophy

This app follows a romantic, elegant aesthetic with:
- **Typography**: Playfair Display for headings, Cormorant Garamond for body text
- **Colors**: Customizable romantic rose and sunset gradients
- **Motion**: Smooth animations using Framer Motion
- **Effects**: Glass morphism, gradients, and Ken Burns photo effect

## 💡 Tips

- Use high-quality photos (1920px+ width recommended)
- Keep timeline events chronological and meaningful
- Write heartfelt, authentic love letters
- Choose colors that match your relationship vibe
- Test on mobile devices for best experience

## 🔧 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Image Handling**: Next.js Image component

## 📝 License

This is a personal project. Feel free to customize and use for your own anniversary celebration!

## 💖 Made with Love

Created to celebrate love, commitment, and beautiful moments together. Happy Anniversary! 🎉

---

## 🆘 Need Help?

If you encounter issues:
1. Make sure all dependencies are installed: `npm install`
2. Clear `.next` cache: `rm -rf .next`
3. Restart dev server: `npm run dev`
4. Check console for errors

## 🎁 Bonus Ideas

- Add a countdown timer to next anniversary
- Create a "memories jar" section
- Add a shared wishlist or bucket list
- Include a message board for daily notes
- Add anniversary reminders
- Create printable versions of letters

Enjoy building your perfect anniversary gift! 💝
