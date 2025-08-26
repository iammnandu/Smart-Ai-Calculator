# import torch
# from transformers import pipeline, BitsAndBytesConfig, AutoProcessor, LlavaForConditionalGeneration
# from PIL import Image

# # quantization_config = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype=torch.float16)
# quantization_config = BitsAndBytesConfig(
#     load_in_4bit=True,
#     bnb_4bit_compute_dtype=torch.float16
# )


# model_id = "llava-hf/llava-1.5-7b-hf"
# processor = AutoProcessor.from_pretrained(model_id)
# model = LlavaForConditionalGeneration.from_pretrained(model_id, quantization_config=quantization_config, device_map="auto")
# # pipe = pipeline("image-to-text", model=model_id, model_kwargs={"quantization_config": quantization_config})

# def analyze_image(image: Image):
#     prompt = "USER: <image>\nAnalyze the equation or expression in this image, and return answer in format: {expr: given equation in LaTeX format, result: calculated answer}"

#     inputs = processor(prompt, images=[image], padding=True, return_tensors="pt").to("cuda")
#     for k, v in inputs.items():
#         print(k,v.shape)

#     output = model.generate(**inputs, max_new_tokens=20)
#     generated_text = processor.batch_decode(output, skip_special_tokens=True)
#     for text in generated_text:
#         print(text.split("ASSISTANT:")[-1])

import google.generativeai as genai
import ast
import json
from PIL import Image
from constants import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

def analyze_image(img: Image, dict_of_vars: dict):
    try:
        # Optimize image size for faster processing
        if img.size[0] > 800 or img.size[1] > 800:
            img.thumbnail((800, 800), Image.Resampling.LANCZOS)
        
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        dict_of_vars_str = json.dumps(dict_of_vars, ensure_ascii=False)
        
        # Enhanced prompt for accurate mathematical analysis
        prompt = (
            f"You are a mathematical expert. Examine this image very carefully and solve what is shown. "
            f""
            f"WHAT TO LOOK FOR: "
            f"1. DRAWN SHAPES: rectangles, circles, triangles with measurements labeled "
            f"2. WRITTEN TEXT: 'find area', 'find perimeter', 'solve for x', etc. "
            f"3. EQUATIONS: algebraic expressions with = sign "
            f"4. CALCULATIONS: arithmetic expressions like 2+3, 5×4, etc. "
            f"5. DIMENSIONS: numbers near shapes indicating length, width, radius "
            f""
            f"SOLVE PRECISELY: "
            f"- If you see a rectangle with dimensions and text asking for AREA → calculate length × width "
            f"- If you see a rectangle with dimensions and text asking for PERIMETER → calculate 2(length + width) "
            f"- If you see a circle with radius and text asking for AREA → calculate π × r² "
            f"- If you see equations with variables → solve for the variable "
            f"- If you see arithmetic expressions → calculate the exact result "
            f""
            f"IMPORTANT: Look at the actual numbers drawn/written in the image, don't guess! "
            f""
            f"Return format: [{{'expr': 'what_problem_you_solved', 'result': 'exact_numerical_answer', 'assign': False}}] "
            f""
            f"Variables: {dict_of_vars_str} "
            f"Return ONLY the Python list."
        )
        
        print(f"Processing image: {img.size}")
        
        # Configure model with faster settings
        generation_config = genai.types.GenerationConfig(
            temperature=0.1,  # Lower temperature for more consistent results
            max_output_tokens=200,  # Limit output for faster response
        )
        
        response = model.generate_content(
            [prompt, img], 
            generation_config=generation_config
        )
        print(f"API Response: {response.text}")
        
        answers = []
        try:
            # Clean the response text by removing markdown code blocks
            response_text = response.text.strip()
            print(f"Raw response: '{response_text}'")
            
            # Remove various markdown patterns
            if response_text.startswith('```python'):
                response_text = response_text[9:]  # Remove ```python
            elif response_text.startswith('```json'):
                response_text = response_text[7:]  # Remove ```json
            elif response_text.startswith('```'):
                response_text = response_text[3:]   # Remove ```
            
            if response_text.endswith('```'):
                response_text = response_text[:-3]  # Remove trailing ```
            
            # Remove any remaining newlines and extra whitespace
            response_text = response_text.strip()
            print(f"Cleaned response: '{response_text}'")
            
            # Try to parse the cleaned response
            answers = ast.literal_eval(response_text)
            print(f"Parsed successfully: {answers}")
            
        except Exception as e:
            print(f"Error in parsing response from Gemini API: {e}")
            print(f"Raw response text: '{response.text}'")
            
            # Enhanced fallback parsing
            try:
                # Try to extract just the list part if there's extra text
                import re
                list_match = re.search(r'\[.*\]', response.text, re.DOTALL)
                if list_match:
                    list_text = list_match.group(0)
                    answers = ast.literal_eval(list_text)
                    print(f"Fallback parsing successful: {answers}")
                else:
                    answers = [{"expr": "Parsing Error", "result": "Could not extract valid response", "assign": False}]
            except:
                answers = [{"expr": "API Error", "result": "Failed to parse response", "assign": False}]
        
        print('returned answer ', answers)
        
        for answer in answers:
            if 'assign' in answer:
                answer['assign'] = True
            else:
                answer['assign'] = False
        
        return answers
        
    except Exception as e:
        print(f"Error in analyze_image function: {e}")
        return [{"expr": "Error", "result": f"API Error: {str(e)}", "assign": False}]