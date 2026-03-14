#!/bin/bash

# סקריפט לעדכון האתר ב-GitHub ו-Vercel
# שימוש: ./deploy.sh "תיאור השינויים"

cd /Users/giladkronman/Documents/kedma-live---artist-management

# בדוק אם יש שינויים
if [[ -z $(git status -s) ]]; then
    echo "❌ אין שינויים לעדכן!"
    exit 1
fi

# הצג את השינויים
echo "📋 השינויים שנמצאו:"
git status -s

# בדוק אם יש commit message
if [ -z "$1" ]; then
    echo "⚠️  אנא ציין תיאור של השינויים:"
    echo "   דוגמה: ./deploy.sh \"עדכון טקסטים בעמוד הבית\""
    exit 1
fi

# הוסף את כל השינויים
echo "➕ מוסיף שינויים..."
git add .

# Safety: abort if any .env file was staged (should be in .gitignore)
if git diff --cached --name-only | grep -q '^\.env'; then
    echo "❌ ביטול: קובץ .env הופיע ברשימת הקבצים. וודא ש-.gitignore מעודכן."
    git reset HEAD
    exit 1
fi

# צור commit
echo "💾 יוצר commit..."
git commit -m "$1"

# העלה ל-GitHub
echo "🚀 מעלה ל-GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ הושלם בהצלחה!"
    echo "📦 השינויים הועלו ל-GitHub"
    echo "⏳ Vercel יתחיל deploy אוטומטי תוך כמה שניות..."
    echo "🔗 אפשר לעקוב אחרי ה-deploy ב-Vercel Dashboard"
else
    echo ""
    echo "❌ שגיאה בהעלאה ל-GitHub"
    exit 1
fi
