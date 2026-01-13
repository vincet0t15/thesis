<?php

namespace App\Http\Requests\OfficeRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfficeUpdateRequest extends FormRequest
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
        $id = $this->route('officeId');

        return [
            'office_name' => [
                'required',
                Rule::unique('offices')->ignore($id),
            ],
            'office_code' => [
                'required',
                Rule::unique('offices')->ignore($id),
            ]
        ];
    }
}
