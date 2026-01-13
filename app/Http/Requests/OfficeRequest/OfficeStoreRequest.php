<?php

namespace App\Http\Requests\OfficeRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfficeStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'office_name' => [
                'required',
                Rule::unique('offices')->whereNull('deleted_at')
            ],
            'office_code' => [
                'required',
                Rule::unique('offices')->whereNull('deleted_at')
            ],
        ];
    }
}
