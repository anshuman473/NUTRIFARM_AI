import os, joblib, pandas as pd

BASE=os.path.dirname(os.path.abspath(__file__))
BUNDLE=joblib.load(os.path.join(BASE,'thali_model_light.pkl'))
MODELS=BUNDLE['models']
CATALOG=BUNDLE['catalog']
COMPONENTS=BUNDLE['components']

def _candidate_names(component, profile):
    region=profile['region']; pref=profile['food_preference']; allergen=profile['allergen']
    out=[]
    for item in CATALOG[component]:
        if region in item['regions'] and pref in item['diet'] and not (allergen!='none' and allergen in item['allergens']):
            out.append(item['name'])
    return out

def recommend_thali(profile, top_n=3):
    clean={
      'region':profile.get('region','North Indian'),
      'health_condition':profile.get('health_condition','none').lower(),
      'food_preference':profile.get('food_preference','veg').lower(),
      'life_stage':profile.get('life_stage','standard').lower(),
      'budget':profile.get('budget','medium').lower(),
      'allergen':profile.get('allergen','none').lower(),
    }
    X=pd.DataFrame([clean])
    result={}; confidence=[]
    for comp in COMPONENTS:
        model=MODELS[comp]
        probs=model.predict_proba(X)[0]
        classes=model.named_steps['rf'].classes_
        ranked=sorted(zip(classes,probs), key=lambda z:-z[1])
        allowed=set(_candidate_names(comp,clean))
        ranked_allowed=[x for x in ranked if x[0] in allowed]
        # Hard guardrail: only return an allergen-safe and preference/region-compatible item.
        if not ranked_allowed:
            raise ValueError(f'No eligible {comp} item for profile constraints')
        top=ranked_allowed[:top_n]
        best, p=top[0]
        result[comp]={'recommendation':best,'model_confidence':round(float(p)*100,1),
                      'alternatives':[{'item':n,'confidence':round(float(pr)*100,1)} for n,pr in top]}
        confidence.append(float(p))
    result['overall_model_confidence']=round(sum(confidence)/len(confidence)*100,1)
    result['profile']=clean
    result['safety_note']='Prototype recommendation only; not a medical diagnosis or individualized treatment plan. Allergies are hard-filtered.'
    return result

if __name__=='__main__':
    import json
    demo={'region':'South Indian','health_condition':'diabetes','food_preference':'veg','life_stage':'standard','budget':'medium','allergen':'dairy'}
    print(json.dumps(recommend_thali(demo), indent=2))
