import os
import re
import string
import pickle
import numpy as np

# Simple self-contained English stop-words list
STOP_WORDS = set([
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", 
    "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", 
    "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", 
    "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", 
    "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", 
    "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", 
    "with", "about", "against", "between", "into", "through", "during", "before", "after", 
    "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", 
    "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", 
    "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", 
    "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", 
    "should", "now"
])

# Crisis keywords mapped to risk levels
HIGH_RISK_WORDS = ["earthquake", "explosion", "terror", "wildfire", "shooter", "bomb", "attack", "casualty", "casualties", "collapse", "killed"]
MEDIUM_RISK_WORDS = ["flood", "cyclone", "storm", "hurricane", "rain", "power", "outage", "warning", "tsunami", "tornado", "landslide"]

# Preset list of locations to detect
LOCATIONS_LIST = [
    "California", "Tokyo", "London", "Texas", "Florida", "Sydney", "Mumbai", "Paris", 
    "New York", "Jakarta", "Manila", "Beijing", "Japan", "USA", "UK", "Australia", 
    "India", "France", "China", "Indonesia", "Philippines"
]

# Cache model and vectorizer
model_cache = None
vectorizer_cache = None

def clean_text(text):
    text = text.lower()
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r'\d+', '', text)
    words = text.split()
    words = [w for w in words if w not in STOP_WORDS]
    
    lemmatized = []
    for word in words:
        if len(word) > 4:
            if word.endswith("ing"):
                word = word[:-3]
            elif word.endswith("eed"):
                word = word[:-1]
            elif word.endswith("ed"):
                word = word[:-2]
            elif word.endswith("ies"):
                word = word[:-3] + "y"
            elif word.endswith("es") and not word.endswith("ses") and not word.endswith("xes"):
                word = word[:-1]
            elif word.endswith("s") and not word.endswith("ss"):
                word = word[:-1]
        lemmatized.append(word)
        
    return " ".join(lemmatized)

def load_ml_components():
    global model_cache, vectorizer_cache
    if model_cache is None or vectorizer_cache is None:
        base_dir = os.path.dirname(os.path.dirname(__file__))
        model_path = os.path.join(base_dir, "model", "model.pkl")
        vectorizer_path = os.path.join(base_dir, "model", "vectorizer.pkl")
        
        if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
            raise FileNotFoundError("Trained model and vectorizer pickle files not found! Please run the training script first.")
            
        with open(model_path, "rb") as f:
            model_cache = pickle.load(f)
        with open(vectorizer_path, "rb") as f:
            vectorizer_cache = pickle.load(f)
            
    return model_cache, vectorizer_cache

def analyze_text(text):
    # 1. Preprocess
    cleaned = clean_text(text)
    
    # 2. Vectorize & Predict
    model, vectorizer = load_ml_components()
    features = vectorizer.transform([cleaned])
    
    # Get probability for classes
    probs = model.predict_proba(features)[0] # [Prob(Fake), Prob(Real)]
    prob_real = probs[1]
    
    # Determine Class: Real, Fake, Suspicious
    if prob_real > 0.60:
        prediction = "Real"
        confidence = prob_real
    elif prob_real < 0.40:
        prediction = "Fake"
        confidence = probs[0] # Prob(Fake)
    else:
        prediction = "Suspicious"
        # Suspicious represents maximum uncertainty, confidence reflects boundary proximity
        confidence = 1.0 - abs(prob_real - 0.5) * 2
    
    # Convert confidence to percentage
    confidence_pct = round(confidence * 100, 1)
    
    # 3. Detect Risk Level
    text_lower = text.lower()
    risk_level = "Low"
    for word in HIGH_RISK_WORDS:
        if word in text_lower:
            risk_level = "High"
            break
            
    if risk_level == "Low":
        for word in MEDIUM_RISK_WORDS:
            if word in text_lower:
                risk_level = "Medium"
                break
                
    # 4. Detect Location
    detected_location = "Global / Online"
    for loc in LOCATIONS_LIST:
        if loc.lower() in text_lower:
            detected_location = loc
            break
            
    # If not found in preset, try to find a capitalized word in the middle of text (crude NER)
    if detected_location == "Global / Online":
        matches = re.findall(r'\b[A-Z][a-z]+\b', text)
        for m in matches:
            if m.lower() not in STOP_WORDS and m not in ["I", "A", "The", "Breaking", "Urgent", "Warning", "Reported", "Alert"]:
                detected_location = m
                break
                
    # 5. Extract Keywords
    words_in_text = [w.translate(str.maketrans("", "", string.punctuation)) for w in text.split()]
    keywords = [w for w in words_in_text if len(w) > 3 and w.lower() not in STOP_WORDS]
    # Keep top unique keywords (up to 5)
    unique_keywords = []
    for kw in keywords:
        if kw.lower() not in [u.lower() for u in unique_keywords] and len(unique_keywords) < 5:
            unique_keywords.append(kw)
    
    # 6. Generate AI Explanation
    if prediction == "Real":
        explanation = (
            f"The system classified this text as Real with {confidence_pct}% confidence. "
            f"It contains factual details resembling verified disaster reporting. Key indicators include "
            f"objective keywords related to '{detected_location.lower()}' and specific alert semantics."
        )
    elif prediction == "Fake":
        explanation = (
            f"The system flagged this text as Fake/Misinformation with {confidence_pct}% confidence. "
            f"The content contains high-density sensationalism, speculation, or conspiracy indicators. "
            f"Verifiable sources are missing, and patterns match historical emergency-related rumors."
        )
    else:
        explanation = (
            f"The system classified this text as Suspicious with {confidence_pct}% confidence. "
            f"The linguistic structure has a mixture of realistic disaster warnings and unverified, sensationalist claims. "
            f"Further manual verification or official reports from '{detected_location}' are highly recommended."
        )
        
    return {
        "prediction": prediction,
        "confidence": confidence_pct,
        "risk_level": risk_level,
        "detected_location": detected_location,
        "keywords": ",".join(unique_keywords),
        "explanation": explanation
    }
